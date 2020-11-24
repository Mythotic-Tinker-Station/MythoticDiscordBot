import { Event, EventOptions } from '../../Structures/Event';
import client from '../../index';

module.exports = class extends Event {

    constructor() {
        const name = 'guildCreate'
        const options: EventOptions = {
            name: 'guildCreate',
            type: 'on',
            emitter: ''
        }

        super(client, name, options)
    }

    async run(guild) {
        console.log(`The bot has joined the guild: ${guild.name}`);
        console.log(guild.id);

        const guildid = guild.id;

        await this.client.utils.processSingleServerConfig(guildid);
        await this.client.utils.loadSingleServerConfig(guildid);
    }
};