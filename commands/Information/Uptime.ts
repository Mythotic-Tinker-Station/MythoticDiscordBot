import { Command, CommandOptions }from '../../Structures/Command';
import client from '../../index';
import ms from 'ms';

module.exports = class extends Command {
    constructor(...args) {
        const name = 'uptime'
        const options: CommandOptions = {
            name: 'uptime',
			aliases: ['up'],
			description: 'Get uptime for the bot',
            category: 'Information',
        }

        super(client, name, options, ...args)
    }

    async run(message) {
        message.channel.send(`**Uptime:** \`${ms(this.client.uptime, { long: true })}\``);
    }
};