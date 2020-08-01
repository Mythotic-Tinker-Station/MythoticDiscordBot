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
const json = require('json');
const BaseServerCfg = require('../ServerData/_ServerDataTemplate.json');

// Stringify Base Server Config
const servercfg = JSON.stringify(BaseServerCfg);

module.exports = class Util {

    constructor(client) {
        this.client = client;
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

    async processServerConfigs() {
        const guildIDs = this.client.guilds.cache.map (i => i.id);
        console.log(guildIDs);

        for (const guildid of guildIDs) {
            const confpath = `${this.directory}ServerData/${guildid}.json`;
            fs.stat(confpath, function(err, data) {
                if (err.code == 'ENOENT') {
                    console.log(`Config ${confpath} does not exist. Creating...`);

                    fs.writeFile(confpath, servercfg, (writerr) => {
                        if (writerr) throw writerr;
                    });

                }
            });


        }

        return glob(`${this.directory}serverdata/*.json`).then(configs => {
            console.log(configs);

            // First, check if there any servers with no config
        });
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