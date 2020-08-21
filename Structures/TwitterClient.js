/* eslint-disable no-useless-catch */
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
            consumer_key: options.ApiKey,
            consumer_secret: options.ApiSecretKey,
            access_token: options.UserAccessToken,
            access_token_secret: options.UserAccessTokenSecret,
        });

        this.currentStreams = new Set();
        this.serverTwitterHandles = new Map();

    }


    /* TODO:
        - Add a way to stop and restart the stream if a twitterhandle is removed/added
        - Have discord send the twitter message and embeds if any to a discord channel in the twitterdata collection via a message embed if possible. Will need to check which user sent the tweet and then
          check to see if they are in the collection and then check which channel ID it was.
        - Add ability to filter out retweets (will need a command to enable that also)
        - Anything else i missed to get this working.
    */

    // note: check currentStreams for a common feed first
    async addTwitterFeed(twitterHandle) {
        // check the streams to see if twitter handle is already therecls
        if(this.currentStreams.has(twitterHandle)) {
            return;
        }
        const twitterUserInfo = await this.get('users/lookup', { screen_name: twitterHandle });
        const twitterUserID = twitterUserInfo.data[0].id_str;
        const s = this.stream('statuses/filter', { follow: twitterUserID });
        s.on('tweet', tweet => console.log(tweet));
    }

    removeTwitterFeed(twitterHandle) {
        //todo: remove feed logic
    }

    //
    async start(twitterGuildConfigs) {
        console.log('Twitter API Client started');
        try{
            twitterGuildConfigs.forEach((config, serverName) => {
                const { Feeds } = config;
                Feeds.forEach(({ TwitterHandle }) => {
                    console.log('Going to get user ' + TwitterHandle);
                    this.addTwitterFeed(TwitterHandle).catch(e => e.code === 17 && console.log('User handle doesnt exist.'));
                });
            });
        }
        catch(e) {
            console.error('Error getting something....');
        }
    }
};