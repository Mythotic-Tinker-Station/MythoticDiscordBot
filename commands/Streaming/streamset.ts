import { Command, CommandOptions } from '../../Structures/Command';
import client from '../../index';

module.exports = class extends (
	Command
) {
	constructor(...args) {
		const name = 'twitterset';
		const options: CommandOptions = {
			name: 'streamset',
			aliases: ['streamsetting', 'streamconfig', 'streamconf'],
			description:
				'Change some Stream Notification Feed settings local to your Discord Server!',
			category: 'Streaming',
			permission: ['MANAGE_GUILD'],
			usage: '<setting> <value>',
			subcommands: {
				streamhannelid: {
					description:
						'Define which channel/s the bot will post stream notifications in',
				},
				streampoststyle: {
					description:
						'Define the post style the bot will use \n Available values are: <NORMAL|SMALL|MEE6_STYLE>',
				},
			},
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
		const validSettings = ['streamhannelid', 'streampoststyle'];
		const newValue = value
		console.log(setting, newValue);

		try {
			const doesSettingExist = validSettings.includes(setting);
			if ((doesSettingExist && newValue === 'true') || newValue === 'false') {
				console.log(
					'Valid Setting passed with value, proceed with changing setting...'
				);
				const guildid = message.guild.id;

				await this.client.utils.editStreamSetting(
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
};
