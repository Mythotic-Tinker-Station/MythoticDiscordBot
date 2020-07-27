const Command = require('../../Structures/Command');
const ms = require('ms');

module.exports = class extends Command {

    async run(message) {
        message.channel.send(`**Uptime:** \`${ms(this.client.uptime, { long: true })}\``);
    }
};