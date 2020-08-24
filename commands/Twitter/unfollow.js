const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'unfollow',
			aliases: ['tweetunfollow', 'deltwitfeed', 'tunfollow'],
			description: 'Stop listening to someones twitter and stop post any new tweets to a channel.',
            category: 'Twitter',
            permission: ['MANAGE_GUILD'],
            usage: '<twitter_handle>',
            },

		);
	}

    // eslint-disable-next-line no-unused-vars
    async noaccess(message, args) {
		await message.channel.send('You do not have the permission to run the set command.');
	}

	async run(message, [twitter_handle]) {
        console.log(`Attempting to remove feed ${twitter_handle}`);

        // Check if the feed exists

        if(this.client.twitterClient.currentStreams.has(twitter_handle)) {
            console.log(`Stream for ${twitter_handle} exists. Attempting removal`);
            try {
                // Remove from current streams first and idealy from the stream itself
                await this.client.twitterClient.removeTwitterFeed(twitter_handle).then(result => {
                    console.log(result);
                    if(result) {
                        
                    }

                }).catch(err => {
                    throw new Error(err);
                });
            }
            catch(err) {
                console.log(err);
            }
        }

        // Must add ability to add twitter handles and discord channel ids to twitter data collection then add the twitter handle to the stream on the twitter client
        // Need to also add a command to remove twitter handles
	}

};