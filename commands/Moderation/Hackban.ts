import { Command, CommandOptions } from '../../Structures/Command';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import client from '../../index';

module.exports = class extends (
	Command
) {
	constructor(...args) {
		const name = 'hackban';
		const options: CommandOptions = {
			name: 'hackban',
			aliases: ['shadowban'],
			description:
				'Ban a user from your discord server if they are not already in the server. (Hackban/Shadowban)',
			category: 'Moderation',
			permission: ['BAN_MEMBERS'],
			usage: '<snowflakeid> [reason]',
			slash_options: {
				name: 'hackban',
				description: 'Ban a user from your discord server if they are not already in the server. (Hackban/Shadowban)',
				options: [
				{
					name: 'user',
					description: 'The users snowflake ID',
					type: 'STRING',
					required: true
				},
				{
					name: 'reason',
					type: 'STRING',
					description: 'The ban reason (optional)',
					required: false
				}]
			}
		};

		super(client, name, options, args);
	}

	// eslint-disable-next-line no-unused-vars
	async noaccess(message, args) {
		await message.channel.send(
			'You do not have the permission to ban someone.'
		);
	}

	// eslint-disable-next-line no-unused-vars
	async run(message, argId, reason?) {
		if (argId) {
			const embed = new MessageEmbed()
				.setColor('RED')
				.setAuthor('!!!WARNING!!! A user has been BANNED')
				.setThumbnail(
					'https://png2.cleanpng.com/sh/c9e9df36b83579a2c9964faa72ba5bd5/L0KzQYm3VcE0N5hqiZH0aYP2gLBuTfhidZ5qip9wYX3oPcHsjwNqd58yitdBaXX6Pbr1lPVzdpZ5RdV7b4X3f7A0VfFnQGFqUKVuZUi7Roi1VcEzOGo9TKI6NUK5QoG9UMg0QWg8RuJ3Zx==/kisspng-hammer-game-pension-review-internet-crouton-5af80e83ee8867.512098401526206083977.png'
				)
				.setFooter(`Action requested by ${message.author.username}`)
				.setTimestamp();

			try {
				const userData = await this.client.users
					.fetch(argId)
					.then((user) => {
						if (!user) {
							throw new Error(
								'Unable to query user. Was this the correct ID?'
							);
						} else {
							console.log(
								`Attempting to ban ${user.username} from ${message.guild.name}`
							);
							return user;
						}
					});

				await message.guild.members
					.ban(userData.id, reason)
					.then(() => {
						embed.setDescription([
							`${userData.username} has been banned from ${message.guild.name}`,
							`***Reason:*** ${reason}`,
						]);
						message.channel.send(embed);
					});
			} catch (err) {
				message.channel.send(`Unable to process ban: ***${err}***`);
			}
		} else {
			await message.channel.send(
				`**${argId}** is not a valid snowflake ID. Try again`
			);
		}
	}

	async slash_run(command, commandInfo: CommandInteraction, args) {
		if (args[0]) {
			const embed = new MessageEmbed()
				.setColor('RED')
				.setAuthor('!!!WARNING!!! A user has been BANNED')
				.setThumbnail(
					'https://png2.cleanpng.com/sh/c9e9df36b83579a2c9964faa72ba5bd5/L0KzQYm3VcE0N5hqiZH0aYP2gLBuTfhidZ5qip9wYX3oPcHsjwNqd58yitdBaXX6Pbr1lPVzdpZ5RdV7b4X3f7A0VfFnQGFqUKVuZUi7Roi1VcEzOGo9TKI6NUK5QoG9UMg0QWg8RuJ3Zx==/kisspng-hammer-game-pension-review-internet-crouton-5af80e83ee8867.512098401526206083977.png'
				)
				.setFooter(`Action requested by ${commandInfo.user.username}`)
				.setTimestamp();

			try {
				let reason = null
				const userData = await this.client.users
					.fetch(args[0])
					.then((user) => {
						if (!user) {
							throw new Error(
								'Unable to query user. Was this the correct ID?'
							);
						} else {
							console.log(
								`Attempting to ban ${user.username} from ${commandInfo.guild.name}`
							);
							return user;
						}
					});
				
				if (args[1]) {
					reason = args[1]
				}
				else {
					reason = "No Reason"
				}

				await commandInfo.guild.members
					.ban(userData.id, reason)
					.then(() => {
						embed.setDescription([
							`${userData.username} has been banned from ${commandInfo.guild.name}`,
							`***Reason:*** ${reason}`,
						]);
						return embed;
					});
			} catch (err) {
				return `Unable to process ban: ***${err}***`;
			}
		} else {
			return `**${args[0]}** is not a valid snowflake ID. Try again`;
		}
	}
};
