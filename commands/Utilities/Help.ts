import { Command, CommandOptions } from '../../Structures/Command';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import client from '../../index';

module.exports = class extends (
	Command
) {
	constructor(...args) {
		const name = 'help';
		const options: CommandOptions = {
			name: 'help',
			description: 'Displays Help information!',
			aliases: ['halp', 'manual', 'rtfm'],
			usage: '[command]',
			category: 'Information',
			slash_options: {
				name: 'help',
				description: 'Displays Help information from Afina!',
				options: [{
					name: 'command',
					description: 'The command you would like info on',
					type: 'STRING',
					required: false
				}]
			}
		};

		super(client, name, options, args);
	}

	// eslint-disable-next-line no-unused-vars
	async noaccess(message, args) {
		await message.channel.send(
			'You do not have the permission to run the help command.'
		);
	}

	// eslint-disable-next-line no-unused-vars
	async run(message, command) {
		if (this.client.user) {
			const serverconf = this.client.serverdata.get(message.guild.id);
			const Prefix = serverconf.Settings.Prefix;

			const embed = new MessageEmbed()
				.setColor('BLUE')
				.setAuthor(
					`${message.guild.name} Help Menu`,
					message.guild.iconURL({ dynamic: true })
				)
				.setThumbnail(this.client.user.displayAvatarURL())
				.setFooter(
					`Requested by ${message.author.username}`,
					message.author.displayAvatarURL({ dynamic: true })
				)
				.setTimestamp();

			if (command) {
				const extCommand = command.toString() || null;
				const cmd: any =
					this.client.commands.get(extCommand) ||
					this.client.commands.get(
						this.client.aliases.get(extCommand)
					);

				if (!cmd)
					return message.channel.send(
						`Invalid Command named. \`${command}\``
					);

				embed.setAuthor(
					`${this.client.utils.captialise(cmd.name)} Command Help`,
					this.client.user.displayAvatarURL()
				);
				embed.setDescription([
					`**❯ Aliases:** ${
						cmd.options.aliases.length
							? cmd.options.aliases
									.map((alias) => `\`${alias}\``)
									.join(' ')
							: 'No Aliases'
					}`,
					`**❯ Description:** ${cmd.options.description}`,
					`**❯ Category:** ${cmd.options.category}`,
					`**❯ Permission:** ${cmd.options.permission}`,
					`**❯ Usage:** ${Prefix}${cmd.options.usage}`,
					`**❯ Arguments:** \n${
						cmd.options.subcommands
							? Object.keys(cmd.options.subcommands)
									.map(
										(argName) =>
											`> \`${argName}\`: ${cmd.options.subcommands[argName].description}`
									)
									.join('\n')
							: 'Not Required'
					}`,
				]);

				return message.channel.send(embed);
			} else {
				embed.setDescription([
					`These are the available commands for ${message.guild.name}`,
					`The bot's prefix is: ${Prefix}`,
					'Command Parameters: `<>` is strict & `[]` is optional',
				]);
				let categories = null;
				if (!this.client.owners.includes(message.author.id)) {
					categories = this.client.utils.removeDuplicates(
						this.client.commands
							.filter(
								(cmd: any) => cmd.options.category !== 'Owner'
							)
							.map((cmd: any) => cmd.options.category)
					);
					console.log(categories);
				} else {
					categories = this.client.utils.removeDuplicates(
						this.client.commands.map(
							(cmd: any) => cmd.options.category
						)
					);
					console.log(categories);
				}

				for (const category of categories) {
					embed.addField(
						`**${this.client.utils.captialise(category)}**`,
						this.client.commands
							.filter(
								(cmd: any) => cmd.options.category === category
							)
							.map((cmd: any) => `\`${cmd.options.name}\``)
							.join(' ')
					);
				}
				return message.channel.send(embed);
			}
		}
	}

	async slash_run(command, commandinfo: CommandInteraction, args) {
		if (this.client.user) {
			const serverconf = this.client.serverdata.get(commandinfo.guildID);
			const Prefix = serverconf.Settings.Prefix;

			const embed = new MessageEmbed()
				.setColor('BLUE')
				.setAuthor(
					`${commandinfo.guild.name} Help Menu`,
					commandinfo.guild.iconURL({ dynamic: true })
				)
				.setThumbnail(this.client.user.displayAvatarURL())
				.setFooter(
					`Requested by ${commandinfo.user.username}`,
					commandinfo.user.displayAvatarURL({ dynamic: true })
				)
				.setTimestamp();

			if (args) {
				const extCommand = args.toString() || null;
				const cmd: any =
					this.client.commands.get(extCommand) ||
					this.client.commands.get(
						this.client.aliases.get(extCommand)
					);

				if (!cmd) {
					const error = `Invalid Command named. \`${command}\``
					return error;
				}
					

				embed.setAuthor(
					`${this.client.utils.captialise(cmd.name)} Command Help`,
					this.client.user.displayAvatarURL()
				);
				embed.setDescription([
					`**❯ Aliases:** ${
						cmd.options.aliases.length
							? cmd.options.aliases
									.map((alias) => `\`${alias}\``)
									.join(' ')
							: 'No Aliases'
					}`,
					`**❯ Description:** ${cmd.options.description}`,
					`**❯ Category:** ${cmd.options.category}`,
					`**❯ Permission:** ${cmd.options.permission}`,
					`**❯ Usage:** ${Prefix}${cmd.options.usage}`,
					`**❯ Arguments:** \n${
						cmd.options.subcommands
							? Object.keys(cmd.options.subcommands)
									.map(
										(argName) =>
											`> \`${argName}\`: ${cmd.options.subcommands[argName].description}`
									)
									.join('\n')
							: 'Not Required'
					}`,
				]);
				return embed;
			} else {
				embed.setDescription([
					`These are the available commands for ${commandinfo.guild.name}`,
					`The bot's prefix is: ${Prefix}`,
					'Command Parameters: `<>` is strict & `[]` is optional',
				]);
				let categories = null;
				if (!this.client.owners.includes(commandinfo.user.id)) {
					categories = this.client.utils.removeDuplicates(
						this.client.commands
							.filter(
								(cmd: any) => cmd.options.category !== 'Owner'
							)
							.map((cmd: any) => cmd.options.category)
					);
					console.log(categories);
				} else {
					categories = this.client.utils.removeDuplicates(
						this.client.commands.map(
							(cmd: any) => cmd.options.category
						)
					);
					console.log(categories);
				}

				for (const category of categories) {
					embed.addField(
						`**${this.client.utils.captialise(category)}**`,
						this.client.commands
							.filter(
								(cmd: any) => cmd.options.category === category
							)
							.map((cmd: any) => `\`${cmd.options.name}\``)
							.join(' ')
					);
				}
				return embed;
			}
		}
	}
};
