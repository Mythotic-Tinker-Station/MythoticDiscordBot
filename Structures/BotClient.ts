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
*/

import { Client, Collection } from 'discord.js'
import {TwitterClient} from './TwitterClient';
import {Util} from './Util';

interface ClientOptions {
	ConfigVersion : string,
	Token : string,
	Owners : Array<string>,
	TwitterAPI : TwitterOptions
	DatabaseURL : String,
}

interface TwitterOptions {
	ApiKey : string,
	ApiSecretKey : string,
	BearerToken : string,
	UserAccessToken : string,
	UserAccessTokenSecret : string
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

	constructor(options : ClientOptions) {
		super({
			disableMentions: 'everyone',
		});

		this.Token = options.Token;

		this.owners = options.Owners;

		this.commands = new Collection();

		this.events = new Collection();

		this.aliases = new Collection();

		this.serverdata = new Collection();

		this.twitterdata = new Map();

		this.utils = new Util(this);

		this.twitterClient = new TwitterClient(options.TwitterAPI, this);

		this.dburl = options.DatabaseURL

		this.Prefix = "$"
	}

	async onReady() {
		console.log([
            `Logged in as ${this.user?.tag}`,
            `Loaded ${this.commands.size} commands!`,
            `Loaded ${this.events.size} events!`,
        ].join('\n'));

		await this.utils.processServerConfigs();
		await this.utils.loadServerConfigs();
		console.log(this.serverdata);
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
		await this.utils.loadCommands();
		await this.utils.loadEvents();
		
		try {
			await super.login(Token);
		}
		catch(err) {
			console.error(`Could not login due to: ${err}`);
		}
	}

};