import { Command, CommandOptions } from '../../Structures/Command';
import client from '../../index';
import { CommandInteraction } from 'discord.js';

module.exports = class extends (
	Command
) {
	constructor(...args) {
		const name = 'twitterset';
		const options: CommandOptions = {
			name: 'twitterset',
			aliases: ['twittersetting', 'twitterconfig', 'twitconf'],
			description:
				'Change some Twitter Feed settings local to your Discord Server!',
			category: 'Twitter',
			permission: ['MANAGE_GUILD'],
			usage: '<setting> <true|false>',
			subcommands: {
				blockretweets: {
					description:
						'Controls weather the bot will post Retweets or not',
				},
				blockreplies: {
					description:
						'Controls weather the bot will post Replies or not',
				},
			},
			slash_options: {
				name: 'twitterset',
				description: 'Set up twitter settings for your server',
				options: [{
					name: 'setting',
					type: 'STRING',
					description: 'The Twitter Setting to change',
					required: true,
					choices: [
						{
							name: 'Block Retweets',
							value: 'blockretweets'
						},
						{
							name: 'Block Replies',
							value: 'blockreplies'
						}
					]
				},
				{
					name: 'value',
					description: 'True/False',
					type: 'BOOLEAN',
					required: true
				}]
			}
		};

		super(client, name, options, args);
	}

	// eslint-disable-next-line no-unused-vars
	async noaccess(message, args) {
		await message.channel.send(
			'You do not have the permission to run the twitterset command.'
		);
	}

	async run(message, setting, value) {
		const validSettings = ['blockretweets', 'blockreplies'];
		const newValue = value[0]
		console.log(setting, newValue);

		try {
			const doesSettingExist = validSettings.includes(setting);
			if ((doesSettingExist && newValue === 'true') || newValue === 'false') {
				console.log(
					'Valid Setting passed with value, proceed with changing setting...'
				);
				const guildid = message.guild.id;

				await this.client.utils.editTwitterSetting(
					guildid,
					setting,
					newValue
				);
				await message.channel.send(
					`***${setting}*** has been changed to: \`${newValue}\``
				);
			} else if (!doesSettingExist || !newValue) {
				if (!doesSettingExist) {
					throw new Error(`The setting ${setting} does not exist`);
				} else {
					throw new Error('Invalid setting/value passed');
				}
			}
		} catch (err) {
			await message.channel.send(
				`Failed to run this command: ***${err}***`
			);
		}
	}

	async slash_run(command, commandInfo: CommandInteraction, args) {
		const setting = args[0]
		const validSettings = ['blockretweets', 'blockreplies'];
		let newValue = null
		
		if (args[1] === true) {
			newValue = "true"
		}
		else {
			newValue = "false"
		}

		console.log(args[0], newValue);

		try {
			const doesSettingExist = validSettings.includes(setting);
			if ((doesSettingExist && newValue === 'true') || newValue === 'false') {
				console.log(
					'Valid Setting passed with value, proceed with changing setting...'
				);
				const guildid = commandInfo.guild.id;

				await this.client.utils.editTwitterSetting(
					guildid,
					setting,
					newValue
				);
				
				return `***${setting}*** has been changed to: \`${newValue}\``;
			} else if (!doesSettingExist || !newValue) {
				if (!doesSettingExist) {
					throw new Error(`The setting ${setting} does not exist`);
				} else {
					throw new Error('Invalid setting/value passed');
				}
			}
		} catch (err) {
			
			return `Failed to run this command: ***${err}***`;
		}
	}
};
