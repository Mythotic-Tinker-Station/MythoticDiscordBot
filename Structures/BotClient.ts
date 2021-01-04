/*
    ---------------------------------------------------------------------
    ---------------------------------------------------------------------
    ----------              Mythotic Tinker bot                ----------
    ---------------------------------------------------------------------
    ---------------------------------------------------------------------

    BotClient.js

    This file contains the actual discord bot client code. it Creates a class
    to be used for creating the bot client. If you need to make changes to the client
    itself, this is the file to do it in.

	For discord.js specifics, id look at the doco https://discord.js.org/#/docs/main/stable/general/welcome

	Commands are located in the commands folder. They are also self explanatory for now
	Events are located in the Events folder, they should be named as discord events that you would like to listen for
*/

import { Client, Collection } from 'discord.js';
import { TwitterClient } from './TwitterClient';
import { Util } from './Util';

interface ClientOptions {
	// Define types for the discord bot client options
	ConfigVersion: string;
	Token: string;
	Owners: Array<string>;
	TwitterAPI: TwitterOptions;
	DatabaseURL: String;
}

interface TwitterOptions {
	// Types for Twitter client options
	ApiKey: string;
	ApiSecretKey: string;
	BearerToken: string;
	UserAccessToken: string;
	UserAccessTokenSecret: string;
}

export class BotClient extends Client {
	Token: string;
	owners: string[];
	commands: Collection<unknown, unknown>;
	events: Collection<unknown, unknown>;
	aliases: Collection<unknown, unknown>;
	serverdata: Map<any, any>;
	twitterdata: Map<any, any>;
	utils: any;
	twitterClient: any;
	Prefix: string;
	uptime: any;
	dburl: any;

	constructor(options: ClientOptions) {
		super({
			disableMentions: 'everyone',
		});

		// Config options
		this.Token = options.Token;
		this.owners = options.Owners;
		this.dburl = options.DatabaseURL;
		this.Prefix = '$';

		// Collections and other mappings
		this.commands = new Collection();
		this.events = new Collection();
		this.aliases = new Collection();
		this.serverdata = new Collection();
		this.twitterdata = new Map();
		this.utils = new Util(this);
		this.twitterClient = new TwitterClient(options.TwitterAPI, this);
		
	}

	async onReady() {
		console.log(
			[
				`Logged in as ${this.user?.tag}`,
				`Loaded ${this.commands.size} commands!`,
				`Loaded ${this.events.size} events!`,
			].join('\n')
		);

		// Load and Process Server configurations
		await this.utils.processServerConfigs();
		await this.utils.loadServerConfigs();
		//load twitter related stuff
		const _twitterdata = this.twitterdata;

		this.serverdata.forEach((value, key) => {
			_twitterdata.set(key, value.Twitter);
		});
		await this.twitterClient.start(this.twitterdata);

		// this.twitterdata needs to be an array of twitter handles from the collection. Same collection will be used for discord channel checking and matching.
	}

	async start(Token = this.Token) {
		this.once('ready', (...args) => this.onReady(...args));
		
		// Load commands and events, then log in boi
		await this.utils.loadCommands();
		await this.utils.loadEvents();

		try {
			await super.login(Token);
		} catch (err) {
			console.error(`Could not login due to: ${err}`);
		}
	}
}
