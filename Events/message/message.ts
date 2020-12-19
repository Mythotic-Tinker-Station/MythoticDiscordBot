import { Event } from '../../Structures/Event';
import { Command } from '../../Structures/Command';

module.exports = class extends (
	Event
) {
	constructor(client) {
		const name = 'message';
		const options = {
			name: 'message',
			type: 'on',
		};

		super(client, name, options);
	}

	async run(message) {
		const mentionRegex = RegExp(`^<@!${this.client.user.id}>$`);
		const mentionRegexPrefix = RegExp(`^<@!${this.client.user.id}> `);

		if (!message.guild || message.author.bot) return;

		if (this.client.serverdata.get(message.guild.id)) {
			const serverconf = this.client.serverdata.get(message.guild.id);

			const Prefix = message.content.match(mentionRegexPrefix)
				? message.content.match(mentionRegexPrefix)[0]
				: serverconf.Settings.Prefix;

			if (message.content.match(mentionRegex))
				message.channel.send(
					`My prefix for **${message.guild.name}** is \`${serverconf.Settings.Prefix}\`.`
				);

			if (!message.content.startsWith(Prefix)) return;

			// eslint-disable-next-line no-unused-vars //
			/* 
            Example strings that could be passed here via discord message:
                !botadmin add "Preachers of Blasphemy"
                !botadmin add "Preachers of Blasphemy" Hordling
                !botadmin add "Preachers of stuff" Hordling SuperAdmin
                !hackban 171142963550879744 "Is Trouble"
                !set Prefix %
                !help set 
            */

			const [cmd, ...args] = message.content
				.slice(Prefix.length)
				.trim()
				.split(/ +/g);

			if (args.length === 0) {
				const command: Command = (this.client.commands.get(
					cmd.toLowerCase()
				) ??
					this.client.commands.get(
						this.client.aliases.get(cmd.toLowerCase())
					)) as Command;
				const newArgs = null;
				if (command) {
					command.prerun(message, newArgs);
				}
			} else {
				const commandArgumentPattern = /(".+?")|\S+/g;
				let cmdArgs = null;
				if (args.length === 1) {
					const command: Command = (this.client.commands.get(
						cmd.toLowerCase()
					) ??
						this.client.commands.get(
							this.client.aliases.get(cmd.toLowerCase())
						)) as Command;

					if (command) {
						command.prerun(message, args);
					}
				} else {
					cmdArgs = args.slice(1).join(' ');
					const tokens: Array<String> = cmdArgs.match(
						commandArgumentPattern
					);
					const filteredTokens = tokens.map((value: any) => {
						if (value === null) return 'None';
						if (value.indexOf('None') === 0) return;
						if (value.indexOf('"') === 0)
							return value.substring(1, value.length - 1);
						return value;
					});

					const command: Command = (this.client.commands.get(
						cmd.toLowerCase()
					) ??
						this.client.commands.get(
							this.client.aliases.get(cmd.toLowerCase())
						)) as Command;

					if (command) {
						command.prerun(message, args, filteredTokens);
					}
				}
			}
		} else {
			const Prefix = message.content.match(mentionRegexPrefix)
				? message.content.match(mentionRegexPrefix)[0]
				: this.client.Prefix;

			if (message.content.match(mentionRegex))
				message.channel.send(
					`My prefix for **${message.guild.name}** is \`${this.client.Prefix}\`.`
				);

			if (!message.content.startsWith(Prefix)) return;

			// eslint-disable-next-line no-unused-vars
			const [cmd, ...args] = message.content
				.slice(Prefix.length)
				.trim()
				.split(/ +/g);

			if (args.length === 0) {
				const command: Command = (this.client.commands.get(
					cmd.toLowerCase()
				) ??
					this.client.commands.get(
						this.client.aliases.get(cmd.toLowerCase())
					)) as Command;
				const newArgs = null;
				if (command) {
					command.prerun(message, newArgs);
				}
			} else {
				const commandArgumentPattern = /(".+?")|\S+/g;
				let cmdArgs = null;
				if (args.length === 1) {
					const command: Command = (this.client.commands.get(
						cmd.toLowerCase()
					) ??
						this.client.commands.get(
							this.client.aliases.get(cmd.toLowerCase())
						)) as Command;

					if (command) {
						command.prerun(message, args);
					}
				} else {
					const cmdArgs = args.slice(1).join(' ');
					const tokens: Array<String> = cmdArgs.match(
						commandArgumentPattern
					);
					const filteredTokens = tokens.map((value) => {
						if (value.indexOf('"') === 0)
							return value.substring(1, value.length - 1);
						if (value.indexOf('None') === 0) return;
						if (value === 'None') return;
						return value;
					});

					console.log(filteredTokens);

					const command = (this.client.commands.get(
						cmd.toLowerCase()
					) ??
						this.client.commands.get(
							this.client.aliases.get(cmd.toLowerCase())
						)) as Command;

					if (command) {
						command.run(message, args, filteredTokens);
					}
				}
			}
		}
	}
};
