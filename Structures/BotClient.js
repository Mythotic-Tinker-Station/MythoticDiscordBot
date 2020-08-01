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

		this.commands = new Collection();

		this.events = new Collection();

        this.aliases = new Collection();

		this.utils = new Util(this);

		this.owners = options.Owners;
	}

	validate(options) {
		if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

		if (!options.Token) throw new Error('You must pass the Token for the client. Please check');
		this.Token = options.Token;

		if (!options.Prefix) throw new Error('You must pass a prefix for the client.');
		if (typeof options.Prefix !== 'string') throw new TypeError('Prefix should be a type of String.');
		this.Prefix = options.Prefix;
	}

	async start(Token = this.Token) {
		await this.utils.loadCommands();
		await this.utils.loadEvents();
		await super.login(Token);
		this.utils.processServerConfigs();
	}

};