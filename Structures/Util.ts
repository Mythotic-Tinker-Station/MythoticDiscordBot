/*
    ---------------------------------------------------------------------
    ---------------------------------------------------------------------
    ----------              Mythotic Tinker bot                ----------
    ---------------------------------------------------------------------
    ---------------------------------------------------------------------

    Util.js

    This file contains utilities that help the bot run. These include a
    command handler.
*/

import path from 'path';
import {promisify} from 'util';
const glob = promisify(require('glob'));
import {Command} from './Command';
import {Event} from './Event';
import fs from 'fs';
import BaseServerCfg from '../ServerDataTemplate/_ServerDataTemplate.json';
import { BotClient } from './BotClient';


export class Util {
    private client: BotClient;
    private stat: any;
    private writeFile: any;



    constructor(client: BotClient) {
        this.client = client;
        this.stat = promisify(fs.stat);
        this.writeFile = promisify(fs.writeFile);
    }

    isClass(input: any) {
        return typeof input === 'function' &&
    typeof input.prototype === 'object' &&
    input.toString().substring(0, 5) === 'class';
    }

    get directory() {
        if (require.main)
            return `${path.dirname(require.main.filename as string)}${path.sep}`;
    }

    formatBytes(bytes: number) {
		if (bytes === 0) return '0 Bytes';
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
    }

    removeDuplicates(arr: any[]) {
        return [...new Set(arr)];
    }

    captialise(string: String) {
        return string.split(' ').map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ');
    }

    async loadCommands() {
        return glob(`${this.directory}commands/**/*.ts`).then((commands: any[]) => {
            for (const commandFile of commands) {
                delete require.cache[commandFile];
                const { name } = path.parse(commandFile);
                const File = require(commandFile);
                if (!this.isClass(File)) throw new TypeError(`Command ${name} does not seem to be a command or does not export a class.`);
                const command = new File(this.client, name.toLowerCase());
                if (!(command instanceof Command)) throw new TypeError(`Command ${name} doesnt belong in Commands`);
                this.client.commands.set(command.options.name, command);
                if (command.options.aliases.length) {
                    for (const alias of command.options.aliases) {
                        this.client.aliases.set(alias, command.options.name);
                    }
                }

            }
        });
    }

    async loadEvents() {
        try {
            return glob(`${this.directory}events/**/*.ts`).then(events => {
                for (const eventFile of events) {
                    delete require.cache[eventFile];
                    const { name } = path.parse(eventFile);
                    const File = require(eventFile);
                    if (!this.isClass(File)) throw new TypeError(`Event ${name} does not seem to be a Discord Event or does not export a class.`);
                    const event = new File(this.client, name);
                    if (!(event instanceof Event)) throw new TypeError(`Event ${name} does not belong in Events`);
                    this.client.events.set(event.options.name, event);
                    console.log(event.options.emitter);
                    event.options.emitter[event.options.type](name, (args) => event.run(args));
                }
            });
        }
        catch(err) {
            console.error(err)
        }
    }

    async callStat(confpath, guildinfo) {
        try {
            await this.stat(confpath);
        }
        catch(err) {
            if (err.code == 'ENOENT') {
                console.log(`Config ${confpath} does not exist. Creating...`);

                const guildsettings = BaseServerCfg;

                guildsettings.ServerName = guildinfo.name;

                const serverinfo = JSON.stringify(guildsettings);
                await this.writeFile(confpath, serverinfo);
            }
        }

    }

    async processServerConfigs() {
        const guildIDs = this.client.guilds.cache.map (i => i.id);

        for (const guildid of guildIDs) {
            const guildinfo = this.client.guilds.cache.get(guildid);
            const confpath = `${this.directory}ServerData/${guildid}.json`;

            await this.callStat(confpath, guildinfo);
        }
    }

    async processSingleServerConfig(guildid) {
            const guildinfo = this.client.guilds.cache.get(guildid);
            const confpath = `${this.directory}ServerData/${guildid}.json`;

            await this.callStat(confpath, guildinfo);
    }

    async loadSingleServerConfig(guildid) {
        const config = `${this.directory}ServerData/${guildid}.json`;
        delete require.cache[config];
        const { name } = path.parse(config);
        const File = require(config);
        this.client.serverdata.set(name, File);

    }

    async loadServerConfigs() {
        return glob(`${this.directory}serverdata/*.json`).then(configs => {
            for (const configFile of configs) {
                delete require.cache[configFile];
                const { name } = path.parse(configFile);
                const File = require(configFile);
                this.client.serverdata.set(name, File);
            }

        });
    }

    async editServerSetting(guildid, setting, value) {
        const confpath = `${this.directory}ServerData/${guildid}.json`;
        const svrConfig = this.client.serverdata.get(guildid);
        const formattedSettingName = [setting[0].toUpperCase(), ...setting.slice(1)].join('');
        svrConfig.Settings[formattedSettingName] = value;
        try {
            await this.writeFile(confpath, JSON.stringify(svrConfig));
        }
        catch(err) {
            console.error(err);
            console.error(`Couldn't update file. Will not save '${setting}'.`);
        }
    }

    async editTwitterSetting(guildid, setting, value) {
        const confpath = `${this.directory}ServerData/${guildid}.json`;
        const svrConfig = this.client.serverdata.get(guildid);
        const formattedSettingName = [setting[0].toUpperCase(), ...setting.slice(1)].join('');

        if(value === 'true') {
            value = true;
        }
        else if(value === 'false') {
            value = false;
        }

        svrConfig.Twitter[formattedSettingName] = value;
        try {
            await this.writeFile(confpath, JSON.stringify(svrConfig));
        }
        catch(err) {
            console.error(err);
            console.error(`Couldn't update file. Will not save '${setting}'.`);
        }
    }

    async editServerTwitterFeedSettings(guildid, value) {
        const confpath = `${this.directory}ServerData/${guildid}.json`;
        const svrConfig = this.client.serverdata.get(guildid);
        svrConfig.Twitter.Feeds = value;
        try {
            await this.writeFile(confpath, JSON.stringify(svrConfig));
        }
        catch(err) {
            console.error(err);
            //onsole.error(`Couldn't update file. Will not save '${setting}'.`);
        }
    }

    trimArray(arr, maxLen = 10) {
        if (arr.length > maxLen) {
            const len = arr.length - maxLen;
            arr = arr.slice(0, maxLen);
            arr.push(`${len} more...`);
        }

        return arr;
    }
};