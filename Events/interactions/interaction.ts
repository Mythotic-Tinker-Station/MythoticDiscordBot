import { Event } from '../../Structures/Event';
import { Command } from '../../Structures/Command';
import { CommandInteraction } from 'discord.js';

module.exports = class extends (
	Event
) {
	constructor(client) {
		const name = 'interaction';
		const options = {
			name: 'interaction',
			type: 'on',
		};

		super(client, name, options);
	}

	async run(interaction: CommandInteraction) {

        if (!interaction.isCommand()) return;
		if (!interaction.guild) return;
        console.log(interaction)

        const _command: Command = (this.client.commands.get(interaction.commandName)) as Command;
        

        const CommandName = interaction.commandName
        const args = interaction.options.map(v => v.value)
        console.log(args)


        if (args.length === 0) {
            await _command.slash_run(CommandName, interaction).then(response => {
                interaction.reply(response)
            })
        }
        else {
            await _command.slash_run(CommandName, interaction, args).then(response => {
                interaction.reply(response)
            })
        }
        
        
	}
};
