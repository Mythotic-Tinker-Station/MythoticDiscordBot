const { MessageEmbed, GuildMember } = require('discord.js');
const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'set',
			aliases: ['setting', 'serverconfig', 'servconf'],
			description: 'Change some server wide settings local to your Discord Server!',
            category: 'Administration',
            permission: ['ADMINISTRATOR'],
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

	run(message, setting, value) {
        

	}

};