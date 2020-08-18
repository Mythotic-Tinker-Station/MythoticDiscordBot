/*
    ---------------------------------------------------------------------
    ---------------------------------------------------------------------
    ----------              Mythotic Tinker bot                ----------
    ---------------------------------------------------------------------
    ---------------------------------------------------------------------

    TwiitterClient.js

    This file contains the actual discord bot client code. it Creates a class
    to be used for creating the bot client. If you need to make changes to the client
    itself, this is the file to do it in.

	For discord.js specifics, id look at the doco https://discord.js.org/#/docs/main/stable/general/welcome

	Commands are located in the commands folder. They are also self explanatory for now
*/

const Twitter = require('twit');
const json = require('json');

module.exports = class TClient extends Twitter {

	constructor(options = {}) {
		super({
            consumer_key: options.TwitterAPI.ApiKey,
            consumer_secret: options.TwitterAPI.ApiSecretKey,
            access_token: options.TwitterAPI.UserAccessToken,
            access_token_secret: options.TwitterAPI.UserAccessTokenSecret,

        });

    }


    /* TODO:
        - Add a way to stop and restart the stream if a twitterhandle is removed
        - Have discord send the twitter message and embeds if any to a discord channel in the twitterdata collection via a message embed if possible. Will need to check which user sent the tweet and then
          check to see if they are in the collection and then check which channel ID it was.
        - Add ability to filter out retweets (will need a command to enable that also)
        - Anything else i missed to get this working.
    */
    async addTwitterFeed(twitterHandle) {
        const twitterUserInfo = await this.get('users/lookup', { screen_name: twitterHandle });
        const twitterUserID = twitterUserInfo.data[0].id_str;
        const s = this.stream('statuses/filter', { follow: twitterUserID });
        s.on('tweet', tweet => console.log(tweet));
    }

    async start([twitterhandlelist]) {
        console.log('Twitter API Client started');

        for (const twitterhandle in twitterhandlelist) {
            try {
                await this.addTwitterFeed(twitterhandle);
            }
            catch(err) {
                console.log(err);
            }
        }
    }
};