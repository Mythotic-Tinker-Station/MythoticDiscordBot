const { MessageEmbed } = require('discord.js');
const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'kick',
			aliases: ['boot', 'kickuser', 'removeuser'],
			description: 'Kick a user from your discord server.',
            category: 'Moderation',
            permission: ['KICK_MEMBERS'],
            usage: '<@Username> [reason]',
		});
	}

    // eslint-disable-next-line no-unused-vars
    async noaccess(message, args) {
		await message.channel.send('You do not have the permission to kick someone.');
	}

    // eslint-disable-next-line no-unused-vars
	async run(message, [argUser, ...reason]) {
        if (message.mentions.members.first()) {

            const embed = new MessageEmbed()
                    .setColor('RED')
                    .setAuthor('!!!WARNING!!! A user has been kicked!')
                    .setThumbnail('https://cdn.icon-icons.com/icons2/564/PNG/512/Action_2_icon-icons.com_54220.png')
                    .setFooter(`Action requested by ${message.author.username}`)
                    .setTimestamp();

            try {
                const username = message.mentions.users.first();
                console.log(`Attempting to kick ${username.username} from ${message.guild.name}`);
                const member = message.mentions.members.first();
                console.log(member);

                if (member.kickable === true) {
                    await member.kick(reason).then(() => {
                        embed.setDescription([`${username} has been kicked from ${message.guild.name}`,
                            `***Reason:*** ${reason}`]);
                        message.channel.send(embed);
                    });

                }
                else {
                    throw new Error(`${member.user.username} is not able to be kicked by me!`);
                }

            }
            catch(err) {
                console.log(err);
            }
        }
	}

};