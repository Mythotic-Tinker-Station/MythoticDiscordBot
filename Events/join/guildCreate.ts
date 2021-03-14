import { Event } from '../../Structures/Event';
module.exports = class extends (
	Event
) {
	constructor(client) {
		const name = 'guildCreate';
		const options = {
			name: 'guildCreate',
			type: 'on',
		};

		super(client, name, options);
	}

	async run(guild) {
		console.log(`The bot has joined the guild: ${guild.name}`);
		console.log(guild.id);

		const guildid = guild.id;

		await this.client.utils.processSingleServerConfig(guildid);
		await this.client.utils.loadSingleServerConfig(guildid);
	}
};
