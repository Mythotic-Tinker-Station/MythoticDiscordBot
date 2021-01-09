import { Command, CommandOptions } from '../../Structures/Command';
import client from '../../index';

module.exports = class extends (
	Command
) {
	constructor(...args) {
		const name = 'follow';
		const options: CommandOptions = {
			name: 'follow',
			aliases: ['tweetfollow', 'twitfeed', 'tfollow'],
			description:
				'Have me listen to someones twitter and post any new tweets to a channel.',
			category: 'Twitter',
			permission: ['MANAGE_GUILD'],
			usage: '<twitter_handle> <discord_channel>',
		};

		super(client, name, options, args);
	}

	// eslint-disable-next-line no-unused-vars
	async noaccess(message, args) {
		await message.channel.send(
			'You do not have the permission to run the follow command.'
		);
	}

	async run(message, feedSettings: Array<String>) {
		const serverCfg = this.client.serverdata.get(message.guild.id);
		
		// Check if discord channel is actually the channel name
		if(!feedSettings[1].match(/<|>|#/gi)) return message.channel.send(`That does not look like a channel name, please ensure the channel name has a # infront of it`)
		
		const discordChannelId = feedSettings[1]
			.toString()
			.replace(/<|>|#/gi, '');
		const twitterHandle = feedSettings[0].toString();

		console.log('Ensuring the config is constructed correctly');

		try {
			const twitterHandleObject = {
				TwitterHandle: twitterHandle,
				DiscordChannelId: discordChannelId,
			};
			const existingObject = serverCfg.Twitter.Feeds;

			const userExists = await this.client.twitterClient.checkIfHandleExists(twitterHandle)

			existingObject.push(twitterHandleObject);
			serverCfg.Twitter.Feeds = existingObject;
			await this.client.utils
				.editServerTwitterFeedSettings(
					message.guild.id,
					serverCfg.Twitter.Feeds
				)
				.then(() => {
					this.client.twitterClient
						.followTwitterHandle(message.guild.id, twitterHandleObject)
						.then(() => {
							message.channel.send(
								`Twitter handle **@${twitterHandle}** is now being followed. Tweets will appear in ${feedSettings[1]}`
							);
							console.log(this.client.twitterClient.twitUserIdArray);
							this.client.twitterClient.createStream();
						});
				});
		} catch (err) {
			message.channel.send(`An Error occured: **${err}**`);
		}

		// Must add ability to add twitter handles and discord channel ids to twitter data collection then add the twitter handle to the stream on the twitter client
		// Need to also add a command to remove twitter handles
	}
};
