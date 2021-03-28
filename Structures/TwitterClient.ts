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

import Twitter, { Stream } from 'twit';
import { MessageEmbed, TextChannel } from 'discord.js';
import { BotClient } from './BotClient';

interface TwitterOptions {
	ApiKey: string;
	ApiSecretKey: string;
	UserAccessToken: string;
	UserAccessTokenSecret: string;
}

export class TwitterClient extends Twitter {
	botClient: BotClient;
	newStream: any;
	serverTwitterHandles: Array<any>;
	twitUserIdArray: Array<any>;

	constructor(options: TwitterOptions, botClient: BotClient) {
		super({
			consumer_key: options.ApiKey,
			consumer_secret: options.ApiSecretKey,
			access_token: options.UserAccessToken,
			access_token_secret: options.UserAccessTokenSecret,

		});
		this.botClient = botClient;
		this.newStream = null;
		this.twitUserIdArray = [];
		this.serverTwitterHandles = [];
	}

	/* TODO:
        - Add a way to stop and restart the stream if a twitterhandle is removed/added
        - Anything else i missed to get this working.
    */

	// note: check currentStreams for a common feed first
	async createStream() {
		// check the streams to see if existing stream exists. If so then stop the stream fist.
		if (this.newStream) this.newStream.stop()

		// Create new stream and monitor events
		this.newStream = this.stream('statuses/filter', { follow: this.twitUserIdArray })
		
		this.newStream.once('connected', (res) => {
			console.log('New Twitter Stream online...');
		})

		this.newStream.on('tweet', (tweet) => {
			console.log(tweet);
			this.handleTweetEvent(tweet).catch((err) => console.log(err))
		});

		this.newStream.on('disconnect', (disconnectMessage) => {
			console.log(disconnectMessage);
		})

		this.newStream.on('warning', (warning) => {
			console.log(warning)
		})

		this.newStream.on(`error`, (statusCode, code, message) => {
			console.log(statusCode);
			console.log(code);
			console.log(message);
		})
	}

	async handleTweetEvent(tweetResponse: any) {
		const channelsListening = this.serverTwitterHandles.filter(
			(serverFeed) =>
				serverFeed.TwitterHandle === tweetResponse.user.screen_name.toLowerCase()
		);
		channelsListening.forEach(async (serverFeed) => {
			const channel: TextChannel = (await this.botClient.channels.fetch(
				serverFeed.DiscordChannelId
			)) as TextChannel;
			const guildId = channel.guild.id;

			const serverTwitterSettings = this.botClient.serverdata.get(
				guildId
			);

			const embed = new MessageEmbed()
				.setAuthor(
					tweetResponse.user.name,
					tweetResponse.user.profile_image_url
				)
				.setURL(
					`https://twitter.com/${tweetResponse.user.screen_name}/status/${tweetResponse.id_str}`
				);

			if (tweetResponse.retweeted_status || tweetResponse.quoted_status) {
				if (serverTwitterSettings.Twitter.Blockretweets === true)
					return;
				embed.setTitle('A Retweet!');
				embed.setColor('DARK_GREEN');
			} else if (
				tweetResponse.in_reply_to_status_id ||
				tweetResponse.in_reply_to_status_id_str ||
				tweetResponse.in_reply_to_user_id ||
				tweetResponse.in_reply_to_user_id_str ||
				tweetResponse.in_reply_to_screen_name
			) {
				if (serverTwitterSettings.Twitter.Blockreplies === true) return;
				embed.setTitle(
					`A reply to @${tweetResponse.in_reply_to_screen_name}`
				);
				embed.setColor('DARK_GREEN');
			} else {
				embed.setTitle('A New Tweet!');
				embed.setColor('GREEN');
			}

			if (tweetResponse.entities.media) {
				const mediaUrl = tweetResponse.entities.media[0].media_url;
				console.log(mediaUrl);
				embed.setImage(mediaUrl);
			}

			if(tweetResponse.truncated === true) {
				embed.setDescription(tweetResponse.extended_tweet.full_text);
			}
			else {
				embed.setDescription(tweetResponse.text);
			}
			
			embed.setFooter(`@${tweetResponse.user.screen_name}`);
			embed.setTimestamp();
			// console.log(tweetResponse);
			channel.send(embed);
		});
	}

	async removeTwitterFeed(message, twitterHandle: any, guildId: any) {
		// First query the serverTwitterHandles array
		const queriedServer = this.serverTwitterHandles.filter(
			(sth) => sth.TwitterHandle === twitterHandle
		);

		// Now perform a check. If Theres more then one queriedServer then we will need to narrow it down
		if (queriedServer) {
			if (queriedServer.length >= 1) {
				const settings = this.botClient.serverdata.get(guildId);
				const twitterSettings = settings.Twitter.Feeds;

				// Find the object required in the twitter settings

				const correctFeed = queriedServer.find(obj => obj.serverName === guildId);
				if (correctFeed.serverName === message.guild.id) {
					console.log(`Got the right one!`);
					console.log(correctFeed);
					console.log(this.serverTwitterHandles.indexOf(correctFeed));
					const removedElement = this.serverTwitterHandles.splice(
						this.serverTwitterHandles.indexOf(correctFeed),
						1
					);
					console.log(
						`Feed for ${twitterHandle} has been removed from the following:`
					);
					console.log(removedElement);
					console.log(`Existing serverHandles Tracked`);
					console.log(this.serverTwitterHandles);
					twitterSettings.splice(
						twitterSettings.map(x => {return x.TwitterHandle}).indexOf(twitterHandle), 1
						
					);

					await this.botClient.utils.editServerTwitterFeedSettings(
						guildId,
						twitterSettings
					)
				}
				
			}
			else {
				// Assume its the correct entry if its only one, and remove the feed all together.
				const settings = this.botClient.serverdata.get(guildId);
				const twitterSettings = settings.Twitter.Feeds;
				const removedElement = this.serverTwitterHandles.splice(
					this.serverTwitterHandles.indexOf(queriedServer),
					1
				);
				console.log(
					`Feed for ${twitterHandle} has been removed from the following:`
				);
				console.log(removedElement);
				console.log(`Existing serverHandles Tracked`);
				console.log(this.serverTwitterHandles);
				
				twitterSettings.splice(
					twitterSettings.map(x => {return x.TwitterHandle}).indexOf(twitterHandle),
					1
				);
				try {
					await this.botClient.utils.editServerTwitterFeedSettings(
						guildId,
						twitterSettings
					).then(async () => {
						await this.checkIfHandleExists(twitterHandle).then(twituser => {
							const twitterUserID: any = twituser.data[0].id_str;
							this.twitUserIdArray.splice(this.twitUserIdArray.indexOf(twitterUserID), 1)
						})
					});
				} catch (err) {
					console.log(err);
				}
			}
		}
	}

	//
	async start(twitterGuildConfigs: any) {
		console.log('Twitter API Client started');
		try {
			twitterGuildConfigs.forEach((config: any, serverName: any) => {
				const { Feeds } = config;
				Feeds.forEach((feed: { TwitterHandle: string, DiscordChannelId: string }) => {
					console.log('Going to get user ' + feed.TwitterHandle);
					const serverHandlerObject = {
						serverName: serverName,
						TwitterHandle: feed.TwitterHandle,
						DiscordChannelId: feed.DiscordChannelId
					};
					
					try {
						this.checkIfHandleExists(serverHandlerObject.TwitterHandle).then(async (twituser) => {
							this.serverTwitterHandles.push(serverHandlerObject);
							const twitterUserID: any = twituser.data[0].id_str;
							
							if (!this.twitUserIdArray.includes(twitterUserID)) {
								this.twitUserIdArray.push(twitterUserID);
								await this.createStream()
							}
						})

						
						
					}
					catch(e) {
						throw new Error(`Twitter handle does not exist on Twitter`)
					}

					
				});
			})
				
		} catch (e) {
			throw new Error(e);
		}
	}

	async followTwitterHandle(guildId: any, twitterHandleObject: any) {
		// Since we are getting the object and guildid already from the follow command, lets build an object that makes fucking sense this time.
		const serverHandlerObject = {
			serverName: guildId,
			TwitterHandle: twitterHandleObject.TwitterHandle,
			DiscordChannelId: twitterHandleObject.DiscordChannelId
		};

		// Now first task is to push this object to this.serverTwitterHandles but check if the object we created is not already there
		if (!this.serverTwitterHandles.some(obj => Object.keys(obj).every(key => obj[key] == serverHandlerObject[key]))) {
			// If an existing object is not the exact same then push it!
			try {
				await this.checkIfHandleExists(serverHandlerObject.TwitterHandle).then((twituser) => {
					this.serverTwitterHandles.push(serverHandlerObject);
					const twitterUserID: any = twituser.data[0].id_str;
					
					if (!this.twitUserIdArray.includes(twitterUserID)) this.twitUserIdArray.push(twitterUserID);
				})
				
			}
			catch(e) {
				throw new Error(`Twitter handle does not exist on Twitter`)
			}
		}
		else {
			throw new Error(`It looks like this server is already following this twitter handle`)
		}
		
		
	
		// Now we can try and get the user and add them to the twituser ID list

		
	}

	async checkIfHandleExists(twitterHandle) {
		const twittUser = await this.get('users/lookup', {
			screen_name: twitterHandle,
		}).catch(error => {
			throw new Error(`Twitter handle does not exist`)
		});
		return twittUser
	}
}
