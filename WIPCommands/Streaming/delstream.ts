import { Command, CommandOptions } from '../../Structures/Command';
import client from '../../index';

module.exports = class extends (
	Command
) {
	constructor(...args) {
		const name = 'delstream';
		const options: CommandOptions = {
			name: 'delstream',
			aliases: ['streamunfollow', 'delstreamfeed', 'sdelete', 'streamremove'],
			description:
				'Remove user from the Stream Notification Service',
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
                            if (!serverCfg.Streams.Streamfeeds.includes(userCheck.id)) throw new Error(`User ${userid} not found in the Stream Notification Service`)
                            const index = serverCfg.Streams.Streamfeeds.indexOf(newUserId, 0)
                            serverCfg.Streams.Streamfeeds.splice(index, 1);
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
                    if (!serverCfg.Streams.Streamfeeds.includes(userCheck.id)) throw new Error(`User ${streamFeedSettings} not found in the Stream Notification Service`)
                    const index = serverCfg.Streams.Streamfeeds.indexOf(newUserId, 0);
                    serverCfg.Streams.Streamfeeds.splice(index, 1)
				} else {
					throw new Error(`Invalid user passed: ${streamFeedSettings}`);
				}
			}

			await this.client.utils
				.editServerStreamsFeedSettings(
					message.guild.id,
					serverCfg.Streams.Streamfeeds
				)
				.then(() => {
					if (streamFeedSettings.length >= 1) {
						message.channel.send(
							`Removed the following users from the Stream Notification Service: ${streamFeedSettings.join(
								' '
							)}`
						);
					} else {
						message.channel.send(
							`Removed ${streamFeedSettings.toString()} from the Stream Notification Service`
						);
					}
				});
		} catch (err) {
			message.channel.send(`An Error occured: **${err}**`);
		}
	}
};
