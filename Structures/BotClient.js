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
const Util = require('./Util.js');

module.exports = class BotClient extends Client {

	constructor(options = {}) {
		super({
			disableMentions: 'everyone',
		});
        this.validate(options);

		this.Token = options.Token;

		this.owners = options.Owners;

		this.commands = new Collection();

		this.events = new Collection();

		this.aliases = new Collection();

		this.serverdata = new Collection();

		this.utils = new Util(this);
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
		console.log(this.serverdata);
	}

	async start(Token = this.Token) {
		this.once('ready', (...args) => this.onReady(...args));
		await this.utils.loadCommands();
		await this.utils.loadEvents();
		await super.login(Token);
	}

};