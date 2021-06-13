import { Command, CommandOptions } from '../../Structures/Command';
import client from '../../index';

module.exports = class extends (
	Command
) {
	constructor(...args) {
		const name = 'set';
		const options: CommandOptions = {
			name: 'set',
			aliases: ['setting', 'serverconfig', 'servconf'],
			description:
				'Change some server wide settings local to your Discord Server!',
			category: 'Administration',
			permission: ['MANAGE_GUILD'],
			usage: '<setting> <value>',
			subcommands: {
				prefix: {
					description: 'Change Server Prefix for this bot',
				},
				welcomemessage: {
					description: 'Set a Welcome Message for new users',
				},
			},
			slash_options: {
				name: 'set',
				description: 'Set bot settings for the guild',
				options: [
					{
						name: 'setting',
						description: 'The command you would like info on',
						type: 'STRING',
						required: true,
						choices: [
							{
								name: 'prefix',
								value: 'prefix'
							},
							{
								name: 'welcomemessage',
								value: 'welcomemessage'
							}
						]
					},
					{
						name: 'value',
						description: 'The Value you require, (either text or true/false)',
						type: 'STRING',
						required: true,
					}
				]
			},
		};

		super(client, name, options, args);
	}

	// eslint-disable-next-line no-unused-vars
	async noaccess(message, args) {
		await message.channel.send(
			'You do not have the permission to run the set command.'
		);
	}

	async run(message, setting, value) {
		const validSettings = [
			'prefix',
			'welcomemessage',
			'adminroles',
			'moderatorroles',
		];

		console.log(setting, value);

		try {
			const doesSettingExist = validSettings.includes(setting);
			if (doesSettingExist && value) {
				console.log(
					'Valid Setting passed with value, proceed with changing setting...'
				);
				const guildid = message.guild.id;

				await this.client.utils.editServerSetting(
					guildid,
					setting,
					value
				);
				
				
				
				await message.channel.send(
					`***${setting}*** has been changed to: \`${value}\``
				);
				

			} else if (!doesSettingExist || !value) {
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

	async slash_run(setting, value, guildid) {
		const validSettings = [
			'prefix',
			'welcomemessage',
			'adminroles',
			'moderatorroles',
		];

		console.log(setting, value);

		try {
			const doesSettingExist = validSettings.includes(setting);
			if (doesSettingExist && value) {
				console.log(
					'Valid Setting passed with value, proceed with changing setting...'
				);

				await this.client.utils.editServerSetting(
					guildid,
					setting,
					value
				);

				const success = `***${setting}*** has been changed to: \`${value}\``
				return success;
				
			} else if (!doesSettingExist || !value) {
				if (!doesSettingExist) {
					throw new Error(`The setting ${setting} does not exist`);
				} else {
					throw new Error('Invalid setting/value passed');
				}
			}
		} catch (err) {
				const error = `Failed to run this command: ***${err}***`
				return error;
		};
	}
};
