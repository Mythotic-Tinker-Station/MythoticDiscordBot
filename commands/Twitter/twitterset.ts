const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'twitterset',
			aliases: ['twittersetting', 'twitterconfig', 'twitconf'],
			description: 'Change some Twitter Feed settings local to your Discord Server!',
            category: 'Twitter',
            permission: ['MANAGE_GUILD'],
            usage: '<setting> <true|false>',
            subcommands: {
                blockretweets: {
                    description: 'Controls weather the bot will post Retweets or not',
                },
                blockreplies: {
                    description: 'Controls weather the bot will post Replies or not',
                },
            },

		});
	}

    // eslint-disable-next-line no-unused-vars
    async noaccess(message, args) {
		await message.channel.send('You do not have the permission to run the twitterset command.');
	}

	async run(message, [setting, value]) {
        const validSettings = ['blockretweets', 'blockreplies'];

        console.log(setting, value);


        try {
            const doesSettingExist = validSettings.includes(setting);
            if (doesSettingExist && value === 'true' || value === 'false') {
                console.log('Valid Setting passed with value, proceed with changing setting...');
                const guildid = message.guild.id;

                await this.client.utils.editTwitterSetting(guildid, setting, value);
                await message.channel.send(`***${setting}*** has been changed to: \`${value}\``);

            }
            else if (!doesSettingExist || !value) {
                if(!doesSettingExist) {
                    throw new Error(`The setting ${setting} does not exist`);
                }
                else {
                    throw new Error('Invalid setting/value passed');
                }
            }
        }
        catch(err) {
            await message.channel.send(`Failed to run this command: ***${err}***`);
        }
	}

};