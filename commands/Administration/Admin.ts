import { Command, CommandOptions } from '../../Structures/Command';
import client from '../../index';

module.exports = class extends (
	Command
) {
	constructor(...args) {
		const name = 'botadmin';
		const options: CommandOptions = {
			name: 'botadmin',
			aliases: ['admin', 'adminrole'],
			description: 'Manage Bot Administrators (Discord server roles)',
			category: 'Administration',
			permission: ['MANAGE_GUILD'],
			usage: '<add|remove> <value> or no subcommands to list admins',
			subcommands: {
				add: {
					description: 'Add discord role as Bot Admin',
				},
				remove: {
					description: 'Remove discord role as Bot Admin',
				},
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

	async run(message, setting, value: Array<String>) {
		const validSettings = ['add', 'remove'];

		console.log(value);

		try {
			const doesSettingExist = validSettings.includes(setting);
			if (doesSettingExist && value) {
				console.log(
					'Valid Setting passed with value, proceed with changing setting...'
				);
				const guildid = message.guild.id;

				if (value.length === 1) {
					const role = await message.guild.roles.cache.find(
						(role) => role.name === value[0]
					);

					try {
						await this.client.utils.editAdminRoles(
							guildid,
							setting,
							role.id
						);
					} catch (error) {
						console.log(error);
					}
				} else {
					const roleArray: Array<String> = [];
					value.forEach((roleName) => {
						const role = message.guild.roles.cache.find(
							(role) => role.name === roleName
						);
						console.log(role);
						roleArray.push(role.id);
					});

					try {
						await this.client.utils.editAdminRoles(
							guildid,
							setting,
							roleArray
						);
					} catch (error) {}
				}
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
};
