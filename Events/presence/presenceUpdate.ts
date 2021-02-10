import { Event } from '../../Structures/Event';
import { Collection, Guild, GuildChannel, Message, Presence, TextChannel } from 'discord.js'

interface messageArray {
    name: string,
    guildid: string,
    message: Message,
}
module.exports = class extends (Event) {
    messageIds: Array<messageArray>;
    pressenceData: Array<Presence>;
    
    constructor(client) {
        const name = 'presenceUpdate';
        const options = {
			name: 'presenceUpdate',
			type: 'on',
        };
        const howManyArgs = 2;

        
        super(client, name, options, howManyArgs);
        this.pressenceData = [];
        this.messageIds = [];
    }

    async run(oldPresence: Presence, newPresence: Presence) {
        // If there is an old presense, if so then we will need to check if they were streaming.
        if (oldPresence) {
            console.log(oldPresence)
            const serverConfigs: Map<any, any> = this.client.serverdata
            for (const activity of newPresence.activities) {
                if (activity.type == "STREAMING") {
                    // Lets check to make sure we got the old data saved also, and make sure it matches. Pretty important
                    console.log(this.pressenceData);
                    console.log(this.messageIds);

                    if (this.pressenceData.includes(oldPresence)) {
                        // If it matches, lets keep going. Checking to see if the user tag exists in messageIds by finding them all.

                        this.messageIds.forEach(async (obj) => {
                            if (obj.name === oldPresence.user.tag) {
                                await obj.message.delete().then( () => console.log(`Message deleted...`))
                            }
                        })
                        
                    }
                }

            }
        }
        

        // Handle each presence type here when required. Obviously streaming first :)
        if (!newPresence.activities) return false;
        for (const activity of newPresence.activities) {
            if (activity.type == "STREAMING") {
                console.log(`${newPresence.user.tag} is streaming at ${activity.url}.`);
                console.log(newPresence)

                // We need to determine if the user is in a server where they have the streaming settings configured
                const serverConfigs: Map<any, any> = this.client.serverdata
                //console.log(serverConfigs)

                const guildsFromPresence: Collection<any, any> = newPresence.user.client.guilds.cache
                console.log(guildsFromPresence)

                guildsFromPresence.forEach(async (guild: Guild ) => {
                    
                    const serverConfig = await serverConfigs.get(guild.id);

                    if (!serverConfig) {
                        console.log("Server config not found")
                        return
                    };

                    // If server config was found, check to see if the setting matches the user
                    if (serverConfig) {
                        // Check Streaming Feeds is set
                        if (serverConfig.Streams.Streamfeeds.includes(newPresence.user.tag) === true) {
                            // In this case, got em. Lets set up the post and set some other variables before firing the message
                            const channelMessage = `**${newPresence.user.tag}** is now streaming! - Click the following link to watch: ${activity.url}`;

                            if (serverConfig.Streams.Deletemessage === true) {
                                this.pressenceData.push(newPresence);
                                const channel: GuildChannel = guild.channels.cache.find(channel => channel.id === serverConfig.Streams.Streamchannelid);
                                if (!((channel): channel is TextChannel => channel.type === 'text')(channel)) return;
                                const sentMessage: Message = await channel.send(channelMessage);
                                this.messageIds.push({
                                    name: newPresence.user.tag,
                                    guildid: guild.id,
                                    message: sentMessage
                                });
                                console.log("Streaming message Sent!")
                            }
                            else {
                                const channel = guild.channels.cache.find(channel => channel.id === serverConfig.Streams.Streamchannelid);
                                if (!((channel): channel is TextChannel => channel.type === 'text')(channel)) return;
                                await channel.send(channelMessage);
                                console.log("Streaming message Sent!")
                            }

                            
                        }
                    }
                })
            };
        }
    }
}