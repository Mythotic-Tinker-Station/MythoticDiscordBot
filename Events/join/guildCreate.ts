import { Event } from '../../Structures/Event';

module.exports = class extends Event {

    async run(guild) {
        console.log(`The bot has joined the guild: ${guild.name}`);
        console.log(guild.id);

        const guildid = guild.id;

        await this.client.utils.processSingleServerConfig(guildid);
        await this.client.utils.loadSingleServerConfig(guildid);
    }
};