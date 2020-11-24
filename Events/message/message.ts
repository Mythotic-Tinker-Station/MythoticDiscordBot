import { Event, EventOptions } from '../../Structures/Event';
import { Command } from '../../Structures/Command';
import client from '../..';

module.exports = class extends Event {

    constructor() {
        const name = 'message'
        const options: EventOptions = {
            name: 'message',
            type: 'on',
            emitter: 'message'
        }

        super(client, name, options)
    }

    async run(message) {
        if (this.client.user) {
            const mentionRegex = RegExp(`^<@!${this.client.user.id}>$`);
            const mentionRegexPrefix = RegExp(`^<@!${this.client.user.id}> `);
        

            if (!message.guild || message.author.bot) return;

            if (this.client.serverdata.get(message.guild.id)) {
                const serverconf = this.client.serverdata.get(message.guild.id);

                const Prefix = message.content.match(mentionRegexPrefix) ?
                message.content.match(mentionRegexPrefix)[0] : serverconf.Settings.Prefix;

                if (message.content.match(mentionRegex)) message.channel.send(`My prefix for **${message.guild.name}** is \`${serverconf.Settings.Prefix}\`.`);

                if(!message.content.startsWith(Prefix)) return;

                // eslint-disable-next-line no-unused-vars
                const [cmd, ...args] = message.content.slice(Prefix.length).trim().split(/ +/g);

                const command: Command = (this.client.commands.get(cmd.toLowerCase()) ?? this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()))) as Command;

                if (command) {
                    command.prerun(message, args);
                }

            }
            else {
                const Prefix = message.content.match(mentionRegexPrefix) ?
                message.content.match(mentionRegexPrefix)[0] : this.client.Prefix;

                if (message.content.match(mentionRegex)) message.channel.send(`My prefix for **${message.guild.name}** is \`${this.client.Prefix}\`.`);

                if(!message.content.startsWith(Prefix)) return;

                // eslint-disable-next-line no-unused-vars
                const [cmd, ...args] = message.content.slice(Prefix.length).trim().split(/ +/g);

                const command = (this.client.commands.get(cmd.toLowerCase()) ?? this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()))) as Command;

                if (command) {
                    command.run(message, args);
                }
        
            }

        }
    }
};