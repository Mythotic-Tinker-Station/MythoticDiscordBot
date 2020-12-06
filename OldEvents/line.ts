import readline from 'readline';
import { Event } from '../Structures/Event';
import { TextChannel } from 'discord.js';
const {defaultChannelId} = require('../config.json');
const { Collection } = require('discord.js');

const regexUsername = /@[a-zA-z0-9]+/g;

module.exports = class extends Event {
    constructor(client) {

        const name = 'line'
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        super(client, name, {
            emitter: rl,
            type: name
        });
        
    }

    async run(input) {
        const textChannel = await this.client.channels.fetch(defaultChannelId, true) as TextChannel;
        const namesToTry = input.match(regexUsername);

        const output = await this.formatStringNamesToId(input, textChannel);
        
        const messageToSend = `\\> ${output}`;
        textChannel.send(messageToSend);
    }


    async formatStringNamesToId(input, channel) {
        const availableUsersInChannel = this.getUsersFromChannel(channel.members);
        const formattedText = input.replace(regexUsername, nameInInput => { 
            const user = this.getUserByName(nameInInput.slice(1), availableUsersInChannel);
            if(user)
                return `<@${user.id}>`;
            else
                return nameInInput;
        });
        return formattedText;
    }

    getUserByName(name, userObjects) {
        const foundUser = userObjects.find(userObject => userObject.user.username === name || userObject.nickname === name);
        if(foundUser)
            return foundUser.user;
    }

    getUsersFromChannel(userCollection) {
        return [...userCollection.values()].map(member => {return {user: member.user, nickname: member.displayName}});
    }
}