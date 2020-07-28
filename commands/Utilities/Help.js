const { MessageEmbed } = require('discord.js');
const Command = require('../../Structures/Command');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'help',
            description: 'A debug command to check latency of the bot',
            aliases: ['halp', 'manual', 'rtfm'],
            usage: '[command]',
        });
    }

    // eslint-disable-next-line no-unused-vars
    async run(message, [command]) {
        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setAuthor(`${message.guild.name} Help Menu`, message.guild.iconURL({ dynamic: true }))
            .setThumbnail(this.client.user.displayAvatarURL())
            .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        if (command) {
            const cmd = this.client.commands.get(command) || this.client.commands.get(this.aliases.get(command));

            if (!cmd) return message.channel.send(`Invalid Command named. \`${command}\``);

            embed.setAuthor;
        }
    }
};