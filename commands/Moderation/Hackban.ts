import { Command, CommandOptions }from '../../Structures/Command';
import { MessageEmbed } from 'discord.js';
import client from '../../index';


module.exports = class extends Command {

	constructor(...args) {
        const name = 'hackban'
        const options: CommandOptions = {
			name: 'hackban',
			aliases: ['shadowban'],
			description: 'Ban a user from your discord server if they are not already in the server. (Hackban/Shadowban)',
            category: 'Moderation',
            permission: ['BAN_MEMBERS'],
            usage: '<snowflakeid> [reason]',
		}
        
        super(client, name, options, ...args);
	}

    // eslint-disable-next-line no-unused-vars
    async noaccess(message, args) {
		await message.channel.send('You do not have the permission to ban someone.');
	}

    // eslint-disable-next-line no-unused-vars
	async run(message, [argId, ...reason]) {

        if (argId) {

            const embed = new MessageEmbed()
                    .setColor('RED')
                    .setAuthor('!!!WARNING!!! A user has been BANNED')
                    .setThumbnail('https://png2.cleanpng.com/sh/c9e9df36b83579a2c9964faa72ba5bd5/L0KzQYm3VcE0N5hqiZH0aYP2gLBuTfhidZ5qip9wYX3oPcHsjwNqd58yitdBaXX6Pbr1lPVzdpZ5RdV7b4X3f7A0VfFnQGFqUKVuZUi7Roi1VcEzOGo9TKI6NUK5QoG9UMg0QWg8RuJ3Zx==/kisspng-hammer-game-pension-review-internet-crouton-5af80e83ee8867.512098401526206083977.png')
                    .setFooter(`Action requested by ${message.author.username}`)
                    .setTimestamp();

            try {
                   const userData = await this.client.users.fetch(argId).then((user) => {
                        if (!user) {
                            throw new Error('Unable to query user. Was this the correct ID?');
                        }
                        else {
                            console.log(`Attempting to ban ${user.username} from ${message.guild.name}`);
                            return(user);
                        }
                    });

                    await message.guild.members.ban(argId, reason.join(' ')).then(() => {
                        embed.setDescription([`${userData.username} has been banned from ${message.guild.name}`,
                            `***Reason:*** ${reason.join(' ')}`]);
                        message.channel.send(embed);
                    });
            }
            catch(err) {
                message.channel.send(`Unable to process ban: ***${err}***`);
            }
        }
        else {
            await message.channel.send(`**${argId}** is not a valid snowflake ID. Try again`);
        }
	}

};