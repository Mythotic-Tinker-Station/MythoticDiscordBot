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

        this.aliases = new Collection();

        this.utils = new Util(this);

		this.once('ready', () => {
			console.log(`Logged in as ${this.user.username}!`);
		});

		this.on('message', async (message) => {
			const mentionRegex = RegExp(`^<@!${this.user.id}>$`);
			const mentionRegexPrefix = RegExp(`^<@!${this.user.id}> `);

			if (!message.guild || message.author.bot) return;

			if (message.content.match(mentionRegex)) message.channel.send(`My prefix for **${message.guild.name}** is \`${this.Prefix}\`.`);

			const Prefix = message.content.match(mentionRegexPrefix) ?
				message.content.match(mentionRegexPrefix)[0] : this.Prefix;

			if(!message.content.startsWith(Prefix)) return;

			// eslint-disable-next-line no-unused-vars
			const [cmd, ...args] = message.content.slice(Prefix.length).trim().split(/ +/g);

            const command = this.commands.get(cmd.toLowerCase()) || this.commands.get(this.aliases.get(cmd.toLowerCase()));

            if (command) {
                command.run(message, args);
            }
		});
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
        this.utils.loadCommands();
        super.login(Token);
	}

};