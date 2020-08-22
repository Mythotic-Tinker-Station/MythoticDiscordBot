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

const { Client, Collection } = require('discord.js');
const TwitterClient = require('./TwitterClient');
const Util = require('./Util.js');

module.exports = class BotClient extends Client {

	constructor(options = {}) {
		super({
			disableMentions: 'everyone',
		});
        this.validate(options);

		this.Token = options.Token;

		this.owners = options.Owners;

		this.commands = new Map();

		this.events = new Map();

		this.aliases = new Map();

		this.serverdata = new Map();

		this.twitterdata = new Map();

		this.utils = new Util(this);

		this.twitterClient = new TwitterClient(options.TwitterAPI, this);
	}

	validate(options) {
		if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

		if (!options.Token) throw new Error('You must pass the Token for the client. Please check');
	}

	async onReady() {
		console.log([
            `Logged in as ${this.user.tag}`,
            `Loaded ${this.commands.size} commands!`,
            `Loaded ${this.events.size} events!`,
        ].join('\n'));

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
		await this.utils.loadCommands();
		await this.utils.loadEvents();
		await super.login(Token);
	}

};