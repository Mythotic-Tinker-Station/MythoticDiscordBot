import { Event } from '../../Structures/Event';
import { GuildChannel, Message, Presence, TextChannel } from 'discord.js'

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
        
        if(oldPresence) {
            let oldStreamingStatus = oldPresence.activities.find(activity => activity.type === 'STREAMING') ? true : false;
            let newStreamingStatus = newPresence.activities.find(activity => activity.type === 'STREAMING') ? true : false;

            if ((oldStreamingStatus === false && newStreamingStatus === false) || (oldStreamingStatus === true && newStreamingStatus === false)) {
                
                // Check to see if there is a current message as if there is, we need to remove it if its being tracked
                const guild = newPresence.guild.id
                const storedMessage = await this.messageIds.find(msg => msg.guildid === guild)
                console.log(this.messageIds)
                if (storedMessage) {
                    try {
                        await storedMessage.message.delete().then((res) => {
                            if (res.deleted === true) console.log(`Previous Message Deleted...`);
                            if (res.deleted === false) throw new Error(`Uh oh, I could not delete the message!`)
                        })
                        this.messageIds.splice(this.messageIds.indexOf(storedMessage), 0)
                    }
                    catch(err) {
                        console.log(err);
                    }
                }
            
            }
            else if (oldStreamingStatus === false && newStreamingStatus === true) {
                //Just started streaming, move on
                console.log(`Detected someone streaming`);
            }
            else if (oldStreamingStatus == newStreamingStatus) {
                //Already streaming, do nothing
                return;
            }
            
        }
            // Handle each presence type here when required. Obviously streaming first :)
            
        if (newPresence) {
            let newStreamingStatus = newPresence.activities.find(activity => activity.type === 'STREAMING') ? true : false;
            
            if (newStreamingStatus === true) {
                const activity = newPresence.activities.find(activity => activity.type === 'STREAMING')
                console.log(`${newPresence.user.tag} is streaming at ${activity.url}.`);

                const guildFromPresence = newPresence.guild.id
                const guild = this.client.guilds.cache.get(guildFromPresence)
                const serverConfig = this.client.serverdata.get(guildFromPresence)

                if (!serverConfig) {
                    console.log("Server config not found")
                    return
                };

                // Check Streaming Feeds is set
                if (serverConfig.Streams.Streamfeeds.includes(newPresence.user.id) === true) {
                    let channelMessage = null
                    if (serverConfig.Streams.Pingrole) {
                        channelMessage = `<@&${serverConfig.Streams.Pingrole}> **${newPresence.user.username}** is now streaming! - Click the following link to watch: ${activity.url}`;
                    }
                    else {
                        channelMessage = `**${newPresence.user.username}** is now streaming! - Click the following link to watch: ${activity.url}`;
                    }
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
        }

    }
}