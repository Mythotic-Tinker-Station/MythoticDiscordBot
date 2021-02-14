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
				streamchannelid: {
					description:
						'Define which channel/s the bot will post stream notifications in',
				},
				streampoststyle: {
					description:
						'Define the post style the bot will use. Available values are: <NORMAL|SMALL|MEE6_STYLE> **NOTE** This command is WIP and it does not set anything at the moment',
				},
				deletemessage: {
					description:
						'After streaming is done, delete the notification post',
				},
				pingrole: {
					description:
						'A role to ping as part of the streaming notification for your server'
				}
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
		const validSettings = ['streamchannelid', 'streampoststyle', 'deletemessage', 'pingrole'];
		const newValue = value.toString().replace(/<|>|#|@|&/gi, '');
		console.log(setting, newValue);

		try {
            const doesSettingExist = validSettings.includes(setting);
            const postStyleValues = [ 'NORMAL', 'SMALL', 'MEE6_STYLE' ];
            const correctStyle = postStyleValues.includes(newValue);
			if (doesSettingExist) {
                console.log('Checking if value is for "streampoststyle"...');
                if (setting === 'streampoststyle' && correctStyle === true) {
                    console.log(`Value Selected for streamrepoststyle: ${value}`);
                }
                else if (setting === 'streampoststyle') {
                    throw new Error(`Invalid value passed. Has to be one of the following: NORMAL, SMALL or MEE6_STYLE`);
                }
                console.log(
					'Valid Setting passed with value, proceed with changing setting...'
				);
				const guildid = message.guild.id;

				await this.client.utils.editStreamSetting(
					guildid,
					setting,
					newValue
				);
				
				if (setting === 'pingrole') {
					await message.channel.send(
						`***${setting}*** has been changed to: <@&${newValue}>`
					);
				}
				else if (setting === 'streamchannelid') {
					await message.channel.send(
						`***${setting}*** has been changed to: <#${newValue}>`
					);
				}
				else {
					await message.channel.send(
						`***${setting}*** has been changed to: \`${newValue}\``
					);
				}

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
