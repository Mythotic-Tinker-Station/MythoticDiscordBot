const Command = require('../../Structures/Command');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'ping',
            description: 'A debug command to check latency of the bot',
            aliases: ['pong', 'latency'],
        });
    }

    // eslint-disable-next-line no-unused-vars
    async run(message) {
        const msg = await message.channel.send('Pinging...');

        const latency = msg.createdTimestamp - message.createdTimestamp;
        const choices = ['My current ping', 'Ping', 'I think discords chucking a shit. Heres my ping'];
        const response = choices[Math.floor(Math.random() * choices.length)];

        msg.edit(`${response} - Bot Latency: \`${latency}ms\`, API Latency: \`${Math.round(this.client.ws.ping)}ms\``);
    }
};