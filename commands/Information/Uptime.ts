import { Command, CommandOptions } from '../../Structures/Command';
import client from '../../index';
import ms from 'ms';

module.exports = class extends (
	Command
) {
	constructor(...args) {
		const name = 'uptime';
		const options: CommandOptions = {
			name: 'uptime',
			aliases: ['up'],
			description: 'Get uptime for the bot',
			category: 'Information',
			slash_options: {
				name: 'uptime',
				description: 'Shows Afinas uptime'
			}
		};

		super(client, name, options, args);
	}

	async run(message) {
		message.channel.send(
			`**Uptime:** \`${ms(this.client.uptime, { long: true })}\``
		);
	}

	async slash_run(command) {
		
		const reply = `**Uptime:** \`${ms(this.client.uptime, { long: true })}\``
		return reply;
	}
};
