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

	async run(message, [twitter_handle]) {

	}

};