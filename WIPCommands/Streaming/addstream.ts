import { Command, CommandOptions } from '../../Structures/Command';
import client from '../../index';

module.exports = class extends (
	Command
) {
	constructor(...args) {
		const name = 'addstream';
		const options: CommandOptions = {
			name: 'addstream',
			aliases: ['streamfollow', 'addstreamfeed', 'sfollow', 'streamadd'],
			description:
				'Have me post in a channel when someones streaming (Streaming status on discord)',
			category: 'Streaming',
			permission: ['MANAGE_GUILD'],
			usage: '<username/s>',
		};

		super(client, name, options, args);
	}

	// eslint-disable-next-line no-unused-vars
	async noaccess(message, args) {
		await message.channel.send(
			'You do not have the permission to run the follow command.'
		);
	}

	async run(message, streamFeedSettings: Array<String>) {
		const serverCfg = this.client.serverdata.get(message.guild.id);
		console.log(streamFeedSettings);

		try {
			//Getting current stream feed setup and adding the user/s
			if (streamFeedSettings.length >= 2) {
				for (const userid of streamFeedSettings) {
                    try {
                        const newUserId = userid
                            .toString()
                            .replace(/<|>|@|!/gi, '');
                        const userCheck = await this.client.users.fetch(newUserId)
                        if (userCheck) {
                            // Check to make sure the user does not exist in there already first... that could be an issue lol
                            if (serverCfg.Streams.Streamfeeds.includes(userCheck.id)) throw new Error(`User ${userid} has already been added to the Stream Notification Service`)
                            serverCfg.Streams.Streamfeeds.push(newUserId);
                        } else {
                            throw new Error(`Invalid user passed: ${userid}`);
                        }
                    }
                    catch(error) {
                        throw new Error(error);
                    }
                }
			} else {
				const newUserId = streamFeedSettings
					.toString()
					.replace(/<|>|@|!/gi, '');
				const userCheck = await this.client.users.fetch(newUserId);

				if (userCheck) {
                    // Check to make sure the user does not exist in there already first... that could be an issue lol
                    if (serverCfg.Streams.Streamfeeds.includes(userCheck.id)) throw new Error(`User ${streamFeedSettings} has already been added to the Stream Notification Service`)
					serverCfg.Streams.Streamfeeds.push(newUserId);
				} else {
					throw new Error(`Invalid user passed: ${newUserId}`);
				}
			}

			await this.client.utils
				.editServerStreamsFeedSettings(
					message.guild.id,
					serverCfg.Streams.Streamfeeds
				)
				.then(() => {
					if (streamFeedSettings.length >= 2) {
						message.channel.send(
							`Added the following users to the Stream Notification Service: ${streamFeedSettings.join(
								' '
							)}`
						);
					} else {
						message.channel.send(
							`Added ${streamFeedSettings.toString()} to the Stream Notification Service`
						);
					}
				});
		} catch (err) {
			message.channel.send(`An Error occured: **${err}**`);
		}
	}
};
