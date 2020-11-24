import { Command, CommandOptions }from '../../Structures/Command';
import { MessageEmbed } from 'discord.js';
import client from '../../index';

module.exports = class extends Command {

	constructor(...args) {
        const name = 'ban'
        const options: CommandOptions = {
			name: 'ban',
			aliases: ['banhammer', 'banuser'],
			description: 'Ban a user from your discord server.',
            category: 'Moderation',
            permission: ['BAN_MEMBERS'],
            usage: '<@Username> [reason]',
		}
        
        super(client, name, options, ...args);
	}

    // eslint-disable-next-line no-unused-vars
    async noaccess(message, args) {
		await message.channel.send('You do not have the permission to ban someone.');
	}

    // eslint-disable-next-line no-unused-vars
	async run(message, [argUser, ...reason]) {
        if (message.mentions.members.first()) {

            const embed = new MessageEmbed()
                    .setColor('RED')
                    .setAuthor('!!!WARNING!!! A user has been BANNED')
                    .setThumbnail('https://png2.cleanpng.com/sh/c9e9df36b83579a2c9964faa72ba5bd5/L0KzQYm3VcE0N5hqiZH0aYP2gLBuTfhidZ5qip9wYX3oPcHsjwNqd58yitdBaXX6Pbr1lPVzdpZ5RdV7b4X3f7A0VfFnQGFqUKVuZUi7Roi1VcEzOGo9TKI6NUK5QoG9UMg0QWg8RuJ3Zx==/kisspng-hammer-game-pension-review-internet-crouton-5af80e83ee8867.512098401526206083977.png')
                    .setFooter(`Action requested by ${message.author.username}`)
                    .setTimestamp();

            try {
                const username = message.mentions.users.first();

                if (username) {
                    console.log(`Attempting to ban ${username.username} from ${message.guild.name}`);
                    const member = message.mentions.members.first();

                    if (member) {
                        if (member.bannable === true) {
                            await member.ban({ reason: reason.join(' ') }).then(() => {
                                embed.setDescription([`${username} has been banned from ${message.guild.name}`,
                                    `***Reason:*** ${reason.join(' ')}`]);
                                message.channel.send(embed);
                            });

                        }
                        else {
                            throw new Error(`${member.user.username} is not able to be banned by me!`);
                        }
                    }
                    else {
                        throw new Error(`${argUser} is not a member of this guild`);
                    }
                }
                else {
                    throw new Error('No user has been defined');
                }
            }
            catch(err) {
                message.channel.send(`Unable to process ban: ***${err}***`);
            }
        }
        else {
            await message.channel.send(`**${argUser}** is not a valid mention. Try again`);
        }
	}

};