const Command = require('./../Structures/Command');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'ping',
            description: 'A debug command to check if the bot is alive',
        });
    }

    // eslint-disable-next-line no-unused-vars
    async run(message, args) {
        message.channel.send('Pong');
    }
};