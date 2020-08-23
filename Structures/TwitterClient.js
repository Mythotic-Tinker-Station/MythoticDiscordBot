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
            const guildId = channel.guild.id;

            const serverTwitterSettings = this.botClient.serverdata.get(guildId);

            const embed = new MessageEmbed()
                .setAuthor(tweetResponse.user.name, tweetResponse.user.profile_image_url)
                .setURL(`https://twitter.com/${tweetResponse.user.screen_name}/status/${tweetResponse.id_str}`);

            if(tweetResponse.retweeted_status || tweetResponse.quoted_status) {
                if(serverTwitterSettings.Twitter.BlockRetweets === true) return;
                embed.setTitle('A Retweet!');
                embed.setColor('DARK_GREEN');
            }
            else if(tweetResponse.in_reply_to_status_id || tweetResponse.in_reply_to_status_id_str || tweetResponse.in_reply_to_user_id || tweetResponse.in_reply_to_user_id_str || tweetResponse.in_reply_to_screen_name) {
                if(serverTwitterSettings.Twitter.BlockReplies === true) return;
                embed.setTitle(`A reply to @${tweetResponse.in_reply_to_screen_name}`);
                embed.setColor('DARK_GREEN');
            }
            else {
                embed.setTitle('A New Tweet!');
                embed.setColor('GREEN');
            }

            if(tweetResponse.entities.media) {
                const mediaUrl = tweetResponse.entities.media[0].media_url;
                console.log(mediaUrl);
                embed.setImage(mediaUrl);
            }

            embed.setDescription(tweetResponse.text);
            embed.setFooter(`@${tweetResponse.user.screen_name}`);
            embed.setTimestamp();
            // console.log(tweetResponse);
            channel.send(embed);
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