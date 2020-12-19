import { Command, CommandOptions } from '../../Structures/Command';
import client from '../../index';

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
				.removeTwitterFeed(twitter_handle, message.guild.id)
				.then(() => {
					message.channel.send(
						`Twitter handle **@${twitter_handle}** is no longer being followed.`
					);
				});
		} catch (err) {
			message.channel.send(`An Error occured: **${err}**`);
		}

		// Must add ability to add twitter handles and discord channel ids to twitter data collection then add the twitter handle to the stream on the twitter client
		// Need to also add a command to remove twitter handles
	}
};
