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
import fs from 'fs';

interface TwitterOptions {
	ApiKey: string;
	ApiSecretKey: string;
	UserAccessToken: string;
	UserAccessTokenSecret: string;
}

export class TwitterClient extends Twitter {
	botClient: BotClient;
	newStream: Stream;
	newStream2: Stream;
	streamBufferActive: boolean;
	streamBuffer2Active: boolean
	serverTwitterHandles: Array<any>;
	twitUserIdArray: Array<any>;
	previousTweet: any;

	constructor(options: TwitterOptions, botClient: BotClient) {
		super({
			consumer_key: options.ApiKey,
			consumer_secret: options.ApiSecretKey,
			access_token: options.UserAccessToken,
			access_token_secret: options.UserAccessTokenSecret,

		});
		this.botClient = botClient;
		this.newStream = null;
		this.newStream2 = null;
		this.twitUserIdArray = [];
		this.serverTwitterHandles = [];
		this.previousTweet = null
	}

	/* TODO:
        - Add a way to stop and restart the stream if a twitterhandle is removed/added
        - Anything else i missed to get this working.
    */

	// note: check currentStreams for a common feed first
	async createStream() {
		// check for an active stream buffer, (one of them should be active while the other one is not). We need to determine which one to activate and which one to not activate
		// Lets check the first buffer first

		if (this.streamBufferActive === true) {
			
			// If first buffer is currently active, then do the following and activate the 2nd buffer
			this.newStream2 = this.stream('statuses/filter', { follow: this.twitUserIdArray });

			this.newStream2.once('connected', (res) => {
				console.log(`Twitter Stream buffer 2 online. Now proceeding to stop the other stream buffer`);

				this.newStream.stop()
				this.newStream.removeAllListeners()

				this.newStream2.on('tweet', (tweet) => {

					if (this.previousTweet === null) {
						this.previousTweet = tweet
						this.handleTweetEvent(tweet).catch((err) => console.log(err));
					}
					else {
						if (this.previousTweet.id_str) {

							// Check the received tweet, is the same as the previous one.
							if (this.previousTweet.id_str === tweet.id_str) return
							this.previousTweet = tweet
							this.handleTweetEvent(tweet).catch((err) => console.log(err));
						}
					}
		
		
				});
		
				this.newStream2.on('disconnect', (disconnectMessage) => {
					console.log(disconnectMessage);
				})
		
				this.newStream2.on('warning', (warning) => {
					console.log(warning)
				})
		
				this.newStream2.on(`error`, (statusCode, code, message) => {
					console.log(statusCode);
					console.log(code);
					console.log(message);
				})


				this.streamBuffer2Active = true
				this.streamBufferActive = false
			})

		}
		else if (this.streamBuffer2Active === true) {
			// If second buffer is currently active, then do the following and activate the 2nd buffer
			this.newStream = this.stream('statuses/filter', { follow: this.twitUserIdArray });

			this.newStream.once('connected', (res) => {
				console.log(`Twitter Stream buffer 1 online. Now proceeding to stop the other stream buffer`);

				this.newStream2.stop()
				this.newStream2.removeAllListeners()

				this.newStream.on('tweet', (tweet) => {
					if (this.previousTweet === null) {
						this.previousTweet = tweet
						this.handleTweetEvent(tweet).catch((err) => console.log(err));
					}
					else {
						if (this.previousTweet.id_str) {

							// Check the received tweet, is the same as the previous one.
							if (this.previousTweet.id_str === tweet.id_str) return
							this.previousTweet = tweet
							this.handleTweetEvent(tweet).catch((err) => console.log(err));
						}
					}
		
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

				this.streamBuffer2Active = false
				this.streamBufferActive = true
			})
		}
		
	}

	async initialStreamCreate() {
		this.newStream = this.stream('statuses/filter', { follow: this.twitUserIdArray })
		
		this.newStream.once('connected', (res) => {
			console.log('New Twitter Stream online...');

			this.newStream.on('tweet', (tweet) => {
				if (this.previousTweet === null) {
					this.previousTweet = tweet
					this.handleTweetEvent(tweet).catch((err) => console.log(err));
				}
				else {
					if (this.previousTweet.id_str) {

						// Check the received tweet, is the same as the previous one.
						if (this.previousTweet.id_str === tweet.id_str) return
						this.previousTweet = tweet
						this.handleTweetEvent(tweet).catch((err) => console.log(err));
					}
				}
	
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

			this.streamBufferActive = true
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

			if (tweetResponse.hasOwnProperty('extended_tweet') === true) {
				try {
					if (tweetResponse.extended_tweet.entities.media) {
						const mediaUrl = tweetResponse.extended_tweet.entities.media[0].media_url;
						console.log(mediaUrl);
						embed.setImage(mediaUrl);
					}
				}
				catch(e) {
					throw new Error(e) 
				}
			
			}
			else if (tweetResponse.hasOwnProperty('retweeted_status') === true) {
				try {
					if (tweetResponse.retweeted_status.entities.media) {
						const mediaUrl = tweetResponse.retweeted_status.entities.media[0].media_url;
						console.log(mediaUrl);
						embed.setImage(mediaUrl);
					}
					else if (tweetResponse.retweeted_status.hasOwnProperty('extended_tweet') === true) {
						if (tweetResponse.retweeted_status.extended_tweet.entities.media) {
							const mediaUrl = tweetResponse.retweeted_status.extended_tweet.entities.media[0].media_url;
							console.log(mediaUrl);
							embed.setImage(mediaUrl);
						}
					}
				}
				catch(e) {
					throw new Error(e)
				}
			}

			if(tweetResponse.truncated === true) {
				embed.setDescription(tweetResponse.extended_tweet.full_text);
			}
			else if (tweetResponse.retweeted_status.truncated === true) {
				embed.setDescription(tweetResponse.retweeted_status.extended_tweet.full_text);
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
								await this.initialStreamCreate()
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
