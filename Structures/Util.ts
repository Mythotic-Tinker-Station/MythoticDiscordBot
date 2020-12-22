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

import path, { format } from 'path';
import { promisify } from 'util';
const glob = promisify(require('glob'));
import { Command } from './Command';
import { Event } from './Event';
import fs from 'fs';
import Config from '../config.json';
import { BotClient } from './BotClient';
import DB from '../DB';

export class Util {
	private client: BotClient;
	private stat: any;
	private writeFile: any;
	DataBase: DB;

	constructor(client: BotClient) {
		this.client = client;
		this.stat = promisify(fs.stat);
		this.writeFile = promisify(fs.writeFile);
		this.DataBase = new DB(Config.DatabaseURL);
	}

	isClass(input: any) {
		return (
			typeof input === 'function' &&
			typeof input.prototype === 'object' &&
			input.toString().substring(0, 5) === 'class'
		);
	}

	get directory() {
		if (require.main)
			return `${path.dirname(require.main.filename as string)}${
				path.sep
			}`;
	}

	formatBytes(bytes: number) {
		if (bytes === 0) return '0 Bytes';
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${
			sizes[i]
		}`;
	}

	removeDuplicates(arr: any[]) {
		return [...new Set(arr)];
	}

	captialise(string: string) {
		return string
			.split(' ')
			.map((str) => str.slice(0, 1).toUpperCase() + str.slice(1))
			.join(' ');
	}

	async loadCommands() {
		return glob(`${this.directory}commands/**/*.ts`).then(
			(commands: any[]) => {
				for (const commandFile of commands) {
					delete require.cache[commandFile];
					const { name } = path.parse(commandFile);
					const File = require(commandFile);
					if (!this.isClass(File))
						throw new TypeError(
							`Command ${name} does not seem to be a command or does not export a class.`
						);
					const command = new File(this.client, name.toLowerCase());
					if (!(command instanceof Command))
						throw new TypeError(
							`Command ${name} doesnt belong in Commands`
						);
					this.client.commands.set(command.options.name, command);
					if (command.options.aliases.length) {
						for (const alias of command.options.aliases) {
							this.client.aliases.set(
								alias,
								command.options.name
							);
						}
					}
				}
			}
		);
	}

	async loadEvents() {
		try {
			return glob(`${this.directory}events/**/*.ts`).then((events) => {
				for (const eventFile of events) {
					delete require.cache[eventFile];
					const { name } = path.parse(eventFile);
					const File = require(eventFile);
					if (!this.isClass(File))
						throw new TypeError(
							`Event ${name} does not seem to be a Discord Event or does not export a class.`
						);
					const event = new File(this.client, name);
					if (!(event instanceof Event))
						throw new TypeError(
							`Event ${name} does not belong in Events`
						);
					this.client.events.set(event.name, event);
					console.log(event.emitter);
					if (event.howManyArgs === 2) {
						event.emitter[event.type](name, (args, secondaryArgs) => event.run(args, secondaryArgs));
					}
					else {
						event.emitter[event.type](name, (args) => event.run(args));
					}
					
				}
			});
		} catch (err) {
			console.error(err);
		}
	}

	async processServerConfigs() {
		const guildIDs = this.client.guilds.cache.map((i) => i.id);

		for (const guildid of guildIDs) {
			try {
				console.log(`Finding configuration for ${guildid}`);
				const svrCfg = await this.DataBase.getServerConfig(
					guildid
				).catch((err) => {
					throw new Error(err);
				});
			} catch (err) {
				console.log(
					`Assuming the config does not exist for ${guildid}... Creating`
				);
				const discordServer = await this.client.guilds.fetch(guildid);
				try {
					await this.DataBase.createNewServerConfig(
						guildid,
						discordServer.name
					);
				} catch (error) {
					console.error(error);
				}
			}
		}
	}

	async processSingleServerConfig(guildid) {
		const guildinfo = this.client.guilds.cache.get(guildid);

		try {
			await this.DataBase.createNewServerConfig(guildid, guildinfo.name);
		} catch (error) {
			console.error(error);
		}
		//await this.callStat(confpath, guildinfo);
	}

	async loadSingleServerConfig(guildid) {
		const config = await this.DataBase.getServerConfig(guildid);
		const configData = config.toJSON();
		const ServerId = configData._id;
		this.client.serverdata.set(ServerId, configData);
	}

	async loadServerConfigs() {
		const configs = await this.DataBase.getAllServerConfigs();
		for (const config of configs) {
			const configData = config.toJSON();
			const ServerId = configData._id;

			this.client.serverdata.set(ServerId, configData);
		}
	}

	async editServerSetting(guildid, setting, value) {
		const svrConfig = this.client.serverdata.get(guildid);
		const formattedSettingName = [
			setting[0].toUpperCase(),
			...setting.slice(1),
		].join('');
		svrConfig.Settings[formattedSettingName] = value;
		try {
			await this.DataBase.setNewSetting(
				guildid,
				formattedSettingName,
				value
			);
		} catch (err) {
			console.error(err);
			console.error(`Couldn't update file. Will not save '${setting}'.`);
		}
	}

	async editAdminRoles(
		guildid: String,
		setting: String,
		value: Array<String>
	) {
		const svrConfig = this.client.serverdata.get(guildid);

		switch (setting) {
			case 'add':
				if (typeof value === 'string') {
					await this.DataBase.setAdminRoles(guildid, 'add', value);
				} else {
					value.forEach((role) => {
						svrConfig.Settings.Adminroles.push(role);
						this.DataBase.setAdminRoles(guildid, 'add', role);
					});
				}
				break;
			case 'remove':
				if (typeof value === 'string') {
					await this.DataBase.setAdminRoles(guildid, 'remove', value);
				} else {
					value.forEach((role) => {
						const index = svrConfig.Settings.Adminroles.indexOf(
							role,
							0
						);
						svrConfig.Settings.Adminroles.splice(index);
						this.DataBase.setAdminRoles(guildid, 'remove', role);
					});
				}
				break;
		}
	}

	async editTwitterSetting(guildid, setting, value) {
		const svrConfig = this.client.serverdata.get(guildid);
		const formattedSettingName = [
			setting[0].toUpperCase(),
			...setting.slice(1),
		].join('');

		if (value === 'true') {
			value = true;
		} else if (value === 'false') {
			value = false;
		}

		svrConfig.Twitter[formattedSettingName] = value;
		try {
			await this.DataBase.setNewTwitterSetting(
				guildid,
				formattedSettingName,
				value
			);
		} catch (err) {
			console.error(err);
			console.error(`Couldn't update file. Will not save '${setting}'.`);
		}
	}

	async editServerTwitterFeedSettings(guildid, value) {
		const svrConfig = this.client.serverdata.get(guildid);
		svrConfig.Twitter.Feeds = value;
		try {
			await this.DataBase.setTwitterFeeds(guildid, value);
		} catch (err) {
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
}
