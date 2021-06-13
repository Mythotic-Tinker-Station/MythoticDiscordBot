import { Command, CommandOptions } from '../../Structures/Command';
import client from '../../index';
import { CommandInteraction } from 'discord.js';

module.exports = class extends (
	Command
) {
	constructor(...args) {
		const name = 'unfollow';
		const options: CommandOptions = {
			name: 'unfollow',
			aliases: ['tweetunfollow', 'deltwitfeed', 'tunfollow'],
			description:
				'Stop listening to someones twitter and stop post any new tweets to a channel.',
			category: 'Twitter',
			permission: ['MANAGE_GUILD'],
			usage: '<twitter_handle>',
			slash_options: {
				name: 'unfollow',
				description: 'Stop following a twitter handle',
				options: [{
					name: 'twitter_handle',
					description: 'the Twitter User ID to unfollow',
					type: 'STRING',
					required: true
				}]
			}
		};

		super(client, name, options, args);
	}

	// eslint-disable-next-line no-unused-vars
	async noaccess(message, args) {
		await message.channel.send(
			'You do not have the permission to run the unfollow command.'
		);
	}

	async run(message, twitter_handle) {
		console.log(`Attempting to remove feed ${twitter_handle}`);

		// Check if the feed exists

		try {
			// Remove from current streams first and idealy from the stream itself
			await this.client.twitterClient
				.removeTwitterFeed(message, twitter_handle.toString(), message.guild.id)
				.then(() => {
					message.channel.send(
						`Twitter handle **@${twitter_handle}** is no longer being followed.`
					);
					this.client.twitterClient.createStream();
				});
		} catch (err) {
			message.channel.send(`An Error occured: **${err}**`);
		}

		// Must add ability to add twitter handles and discord channel ids to twitter data collection then add the twitter handle to the stream on the twitter client
		// Need to also add a command to remove twitter handles
	}

	async slash_run(command, commandInfo: CommandInteraction, args) {
		const twitter_handle = args[0]
		
		console.log(`Attempting to remove feed ${twitter_handle}`);

		// Check if the feed exists

		try {
			// Remove from current streams first and idealy from the stream itself
			await this.client.twitterClient
				.removeTwitterFeed(commandInfo, twitter_handle.toString(), commandInfo.guild.id)
				.then(() => {
					this.client.twitterClient.restartStream();
					return `Twitter handle **@${twitter_handle}** is no longer being followed.`;
				});
		} catch (err) {
			return `An Error occured: **${err}**`;
		}

		// Must add ability to add twitter handles and discord channel ids to twitter data collection then add the twitter handle to the stream on the twitter client
		// Need to also add a command to remove twitter handles
	}
};
