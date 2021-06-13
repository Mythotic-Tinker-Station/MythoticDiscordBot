import { Command, CommandOptions } from '../../Structures/Command';
import client from '../../index';
import { CommandInteraction } from 'discord.js';

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
			slash_options: {
				name: 'follow',
				description: 'Follow a Twitter feed and select which channel the bot will post tweets in',
				options: [{
					name: 'twitter_handle',
					description: 'The Twitter User ID to follow',
					type: 'STRING',
					required: true
				},
				{
					name: 'channel',
					description: 'The Discord Channel to post in',
					type: 'CHANNEL',
					required: true
				}]
			}
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
							this.client.twitterClient.restartStream();
						});
				});
		} catch (err) {
			message.channel.send(`An Error occured: **${err}**`);
		}
	}

	async slash_run(command, commandInfo: CommandInteraction, args) {
		const serverCfg = this.client.serverdata.get(commandInfo.guild.id);
		const channel = args[1]
		
		// Check if discord channel is actually the channel name
		if(!channel.match(/<|>|#/gi)) return `That does not look like a channel name, please ensure the channel name has a # infront of it`
		
		const discordChannelId = channel
			.toString()
			.replace(/<|>|#/gi, '');
		const twitterHandle = args[0];

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
					commandInfo.guild.id,
					serverCfg.Twitter.Feeds
				)
				.then(() => {
					this.client.twitterClient
						.followTwitterHandle(commandInfo.guild.id, twitterHandleObject)
						.then(() => {
							console.log(this.client.twitterClient.twitUserIdArray);
							this.client.twitterClient.createStream();
							return `Twitter handle **@${twitterHandle}** is now being followed. Tweets will appear in ${channel}`
						});
				});
		} catch (err) {
			return `An Error occured: **${err}**`;
		}
	}
};
