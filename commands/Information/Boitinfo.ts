import { MessageEmbed, version} from 'discord.js';
import { Command, CommandOptions }from '../../Structures/Command';
import client from '../../index';
import { version as confversion } from '../../package.json';
import { utc } from 'moment';
import os from 'os';
import ms from 'ms';

module.exports = class extends Command {

	constructor(...args) {
		const name = 'botinfo'
		const options: CommandOptions = {
			name: 'botinfo',
			aliases: ['info', 'bot'],
			description: 'Displays information about me! (The bot)',
			category: 'Information',
		}
		
		super(client, name, options, ...args);
	}

	async run(message) {
		if (this.client.user) {
			const core = os.cpus()[0];
			const embed = new MessageEmbed()
				.setThumbnail(this.client.user.displayAvatarURL())
				.setColor(message.guild.me.displayHexColor || 'BLUE')
				.addField('General', [
					`**❯ Client:** ${this.client.user.tag} (${this.client.user.id})`,
					`**❯ Commands:** ${this.client.commands.size}`,
					`**❯ Servers:** ${this.client.guilds.cache.size.toLocaleString()} `,
					`**❯ Users:** ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`,
					`**❯ Channels:** ${this.client.channels.cache.size.toLocaleString()}`,
					`**❯ Creation Date:** ${utc(this.client.user.createdTimestamp).format('Do MMMM YYYY HH:mm:ss')}`,
					`**❯ Node.js:** ${process.version}`,
					`**❯ Version:** v${confversion}`,
					`**❯ Discord.js:** v${version}`,
					'\u200b',
				])
				.addField('System', [
					`**❯ Platform:** ${process.platform}`,
					`**❯ Uptime:** ${ms(os.uptime() * 1000, { long: true })}`,
					'**❯ CPU:**',
					`\u3000 Cores: ${os.cpus().length}`,
					`\u3000 Model: ${core.model}`,
					`\u3000 Speed: ${core.speed}MHz`,
					'**❯ Memory:**',
					`\u3000 Total: ${this.client.utils.formatBytes(process.memoryUsage().heapTotal)}`,
					`\u3000 Used: ${this.client.utils.formatBytes(process.memoryUsage().heapUsed)}`,
				])
				.setTimestamp();

			message.channel.send(embed);
		}
	}

};