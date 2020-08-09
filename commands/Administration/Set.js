const { MessageEmbed, GuildMember, Message } = require('discord.js');
const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'set',
			aliases: ['setting', 'serverconfig', 'servconf'],
			description: 'Change some server wide settings local to your Discord Server!',
            category: 'Administration',
            permission: ['MANAGE_GUILD'],
            usage: '<setting> <value>',
            subcommands: {
                prefix: {
                    name: 'prefix',
                    description: 'Change Server Prefix for this bot',
                },
                welcomemessage: {
                    description: 'Set a Welcome Message for new users',
                },
                adminroles: {
                    description: 'Add a role as an Admin for the bot',
                },
                moderatorroles: {
                    description: 'Add a role as a Moderator for the bot',
                },
            },

		});
	}

    async noaccess(message, args) {
		await message.channel.send('You do not have the permission to run the set command.');
	}

	async run(message, [setting, value]) {
        const validSettings = ['prefix', 'welcomemessage', 'adminroles', 'moderatorroles'];

        console.log(setting, value);


        try {
            if (validSettings.find(vSetting => vSetting === setting)) {
                console.log('Valid Setting passed, proceed with changing setting...');

                
            }
            else {
                throw new Error('Setting does not exist');
            }
        }
        catch(err) {
            console.log(err);
        }
	}

};