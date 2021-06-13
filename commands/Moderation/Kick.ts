import { Command, CommandOptions } from '../../Structures/Command';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import client from '../../index';

module.exports = class extends (
	Command
) {
	constructor(...args) {
		const name = 'kick';
		const options: CommandOptions = {
			name: 'kick',
			aliases: ['boot', 'kickuser', 'removeuser'],
			description: 'Kick a user from your discord server.',
			category: 'Moderation',
			permission: ['KICK_MEMBERS'],
			usage: '<@Username> [reason]',
			slash_options: {
				name: 'kick',
				description: 'Kick a user from your discord server.',
				options: [
				{
					name: 'user',
					description: 'The user to kick',
					type: 'USER',
					required: true
				},
				{
					name: 'reason',
					type: 'STRING',
					description: 'The kick reason (optional)',
					required: false
				}]
			}
		};

		super(client, name, options, args);
	}

	// eslint-disable-next-line no-unused-vars
	async noaccess(message, args) {
		await message.channel.send(
			'You do not have the permission to kick someone.'
		);
	}

	// eslint-disable-next-line no-unused-vars
	async run(message, argUser, reason) {
		if (message.mentions.members.first()) {
			const embed = new MessageEmbed()
				.setColor('RED')
				.setAuthor('!!!WARNING!!! A user has been kicked!')
				.setThumbnail(
					'https://cdn.icon-icons.com/icons2/564/PNG/512/Action_2_icon-icons.com_54220.png'
				)
				.setFooter(`Action requested by ${message.author.username}`)
				.setTimestamp();

			try {
				const username = message.mentions.users.first();

				if (username) {
					console.log(
						`Attempting to kick ${username.username} from ${message.guild.name}`
					);
					const member = message.mentions.members.first();

					if (member) {
						if (member.kickable === true) {
							await member.kick(reason).then(() => {
								embed.setDescription([
									`${username} has been kicked from ${message.guild.name}`,
									`***Reason:*** ${reason}`,
								]);
								message.channel.send(embed);
							});
						} else {
							throw new Error(
								`${member.user.username} is not able to be kicked by me!`
							);
						}
					} else {
						throw new Error(
							`${argUser} is not a member of this guild`
						);
					}
				} else {
					throw new Error('No user has been defined');
				}
			} catch (err) {
				console.log(err);
			}
		} else {
			await message.channel.send(
				`**${argUser}** is not a valid mention. Try again`
			);
		}
	}

	async slash_run(command, commandInfo: CommandInteraction, args) {
		if (args[0]) {
			let reason = null;
			const embed = new MessageEmbed()
				.setColor('RED')
				.setAuthor('!!!WARNING!!! A user has been kicked!')
				.setThumbnail(
					'https://cdn.icon-icons.com/icons2/564/PNG/512/Action_2_icon-icons.com_54220.png'
				)
				.setFooter(`Action requested by ${commandInfo.user.username}`)
				.setTimestamp();

			try {
				const username = commandInfo.guild.members.cache.get(args[0])

				if (username) {
					console.log(
						`Attempting to kick ${username.user.username} from ${commandInfo.guild.name}`
					);
					const member = username;

					if (member) {
						if (member.kickable === true) {
							await member.kick(reason).then(() => {
								embed.setDescription([
									`${username} has been kicked from ${commandInfo.guild.name}`,
									`***Reason:*** ${reason}`,
								]);
								return embed;
							});
						} else {
							throw new Error(
								`${member.user.username} is not able to be kicked by me!`
							);
						}
					} else {
						throw new Error(
							`${member.user.username} is not a member of this guild`
						);
					}
				} else {
					throw new Error('No user has been defined');
				}
			} catch (err) {
				return `Unable to process kick: ***${err}***`;
			}
		} else {
			
			return `**${args[0]}** is not a valid mention. Try again`;
		}
	}
};
