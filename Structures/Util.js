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

const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const Command = require('./Command.js');
const Event = require('./Event');
const fs = require('fs');
const BaseServerCfg = require('../ServerData/_ServerDataTemplate.json');

module.exports = class Util {

    constructor(client) {
        this.client = client;
        this.stat = promisify(fs.stat);
        this.writeFile = promisify(fs.writeFile);
    }

    isClass(input) {
        return typeof input === 'function' &&
    typeof input.prototype === 'object' &&
    input.toString().substring(0, 5) === 'class';
    }

    get directory() {
        return `${path.dirname(require.main.filename)}${path.sep}`;
    }

    formatBytes(bytes) {
		if (bytes === 0) return '0 Bytes';
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
    }

    removeDuplicates(arr) {
        return [...new Set(arr)];
    }

    captialise(string) {
        return string.split(' ').map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ');
    }

    async loadCommands() {
        return glob(`${this.directory}commands/**/*.js`).then(commands => {
            for (const commandFile of commands) {
                delete require.cache[commandFile];
                const { name } = path.parse(commandFile);
                const File = require(commandFile);
                if (!this.isClass(File)) throw new TypeError(`Command ${name} does not seem to be a command or does not export a class.`);
                const command = new File(this.client, name.toLowerCase());
                if (!(command instanceof Command)) throw new TypeError(`Command ${name} doesnt belong in Commands`);
                this.client.commands.set(command.name, command);
                if (command.aliases.length) {
                    for (const alias of command.aliases) {
                        this.client.aliases.set(alias, command.name);
                    }
                }

            }
        });
    }

    async loadEvents() {
        return glob(`${this.directory}events/**/*.js`).then(events => {
            for (const eventFile of events) {
                delete require.cache[eventFile];
                const { name } = path.parse(eventFile);
                const File = require(eventFile);
                if (!this.isClass(File)) throw new TypeError(`Event ${name} does not seem to be a Discord Event or does not export a class.`);
                const event = new File(this.client, name);
                if (!(event instanceof Event)) throw new TypeError(`Event ${name} does not belong in Events`);
                this.client.events.set(event.name, event);
                event.emitter[event.type](name, (...args) => event.run(...args));
            }
        });
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
            console.err(err);
            console.err(`Couldn't update file. Will not save '${setting}'.`);
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