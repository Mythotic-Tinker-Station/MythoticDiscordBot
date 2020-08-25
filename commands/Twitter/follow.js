const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'follow',
			aliases: ['tweetfollow', 'twitfeed', 'tfollow'],
			description: 'Have me listen to someones twitter and post any new tweets to a channel.',
            category: 'Twitter',
            permission: ['MANAGE_GUILD'],
            usage: '<twitter_handle> <discord_channel>',
            },

		);
	}

    // eslint-disable-next-line no-unused-vars
    async noaccess(message, args) {
		await message.channel.send('You do not have the permission to run the set command.');
	}

	async run(message, [twitterHandle, discordChannel]) {
		const serverCfg = this.client.serverdata.get(message.guild.id);
		const discordChannelId = discordChannel.replace(/<|>|#/gi, '');

		console.log('Ensuring the config is constructed correctly');

		try {
			const twitterHandleObject = { TwitterHandle: twitterHandle, DiscordChannelId: discordChannelId };
			const existingObject = serverCfg.Twitter.Feeds;

			existingObject.push(twitterHandleObject);
			serverCfg.Twitter.Feeds = existingObject;
			await this.client.utils.editServerTwitterFeedSettings(message.guild.id, serverCfg.Twitter.Feeds)
				.then(() => {
					this.client.twitterClient.followTwitterHandle(message.guild.id)
						.then(() => {
							message.channel.send(`Twitter handle **@${twitterHandle}** is now being followed. Tweets will appear in ${discordChannel}`);
						});
				});

		}
		catch(err) {
			message.channel.send(`An Error occured: **${err}**`);
		}


        // Must add ability to add twitter handles and discord channel ids to twitter data collection then add the twitter handle to the stream on the twitter client
        // Need to also add a command to remove twitter handles
	}

};