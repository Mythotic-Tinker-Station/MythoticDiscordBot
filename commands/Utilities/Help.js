const { MessageEmbed } = require('discord.js');
const Command = require('../../Structures/Command');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'help',
            description: 'Displays Help information!',
            aliases: ['halp', 'manual', 'rtfm'],
            usage: '[command]',
			category: 'Information',
        });
    }

	// eslint-disable-next-line no-unused-vars
	async noaccess(message, args) {
		await message.channel.send('You do not have the permission to run the help command.');
	}

    // eslint-disable-next-line no-unused-vars
    async run(message, [command]) {
		const serverconf = this.client.serverdata.get(message.guild.id);
		const Prefix = serverconf.Settings.Prefix;

		const embed = new MessageEmbed()
			.setColor('BLUE')
			.setAuthor(`${message.guild.name} Help Menu`, message.guild.iconURL({ dynamic: true }))
			.setThumbnail(this.client.user.displayAvatarURL())
			.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		if (command) {
			const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));

			if (!cmd) return message.channel.send(`Invalid Command named. \`${command}\``);

			embed.setAuthor(`${this.client.utils.captialise(cmd.name)} Command Help`, this.client.user.displayAvatarURL());
			embed.setDescription([
				`**❯ Aliases:** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'No Aliases'}`,
				`**❯ Description:** ${cmd.description}`,
				`**❯ Category:** ${cmd.category}`,
				`**❯ Permission:** ${cmd.permission}`,
				`**❯ Usage:** ${Prefix}${cmd.usage}`,
				`**❯ Arguments:** \n${Object.keys(cmd.subcommands).map(argName => `> \`${argName}\`: ${cmd.subcommands[argName].description}`).join('\n')}`,
			]);

			return message.channel.send(embed);
		}
 else {
			embed.setDescription([
				`These are the available commands for ${message.guild.name}`,
				`The bot's prefix is: ${Prefix}`,
				'Command Parameters: `<>` is strict & `[]` is optional',
			]);
			let categories;
			if (!this.client.owners.includes(message.author.id)) {
				categories = this.client.utils.removeDuplicates(this.client.commands.filter(cmd => cmd.category !== 'Owner').map(cmd => cmd.category));
			}
 else {
				categories = this.client.utils.removeDuplicates(this.client.commands.map(cmd => cmd.category));
			}

			for (const category of categories) {
				embed.addField(`**${this.client.utils.captialise(category)}**`, this.client.commands.filter(cmd =>
					cmd.category === category).map(cmd => `\`${cmd.name}\``).join(' '));
			}
			return message.channel.send(embed);
		}
	}

};