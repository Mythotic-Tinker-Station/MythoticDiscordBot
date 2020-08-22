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
const { MessageEmbed } = require('discord.js');
const json = require('json');

module.exports = class TClient extends Twitter {

	constructor(options = {}, botClient) {
		super({
            consumer_key: options.ApiKey,
            consumer_secret: options.ApiSecretKey,
            access_token: options.UserAccessToken,
            access_token_secret: options.UserAccessTokenSecret,
        });
        this.botClient = botClient;
        this.currentStreams = new Set();
        this.serverTwitterHandles = [];

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
        this.currentStreams.add(s);
        s.on('tweet', tweet => this.handleTweetEvent(tweet));
    }

    async handleTweetEvent(tweetResponse) {
        const channelsListening = this.serverTwitterHandles.filter(feed => feed.TwitterHandle === tweetResponse.user.screen_name);
        channelsListening.forEach(async feed => {
            const channel = await this.botClient.channels.fetch(feed.DiscordChannelId);
            channel.send(tweetResponse.text);
        });
    }

    removeTwitterFeed(twitterHandle) {
        // todo: remove feed logic
    }

    //
    async start(twitterGuildConfigs) {
        console.log('Twitter API Client started');
        try{
            twitterGuildConfigs.forEach((config, serverName) => {
                const { Feeds } = config;
                Feeds.forEach(feed => {
                    console.log('Going to get user ' + feed.TwitterHandle);
                    this.addTwitterFeed(feed.TwitterHandle)
                        .then(() => this.serverTwitterHandles.push(feed))
                        .catch(e => e.code === 17 && console.log('User handle doesnt exist.'));
                });
            });
        }
        catch(e) {
            console.error('Error getting something....');
        }
    }
};