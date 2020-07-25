/*

Mythotic Discord bot

Right now its just some stupid experiment


*/

// Import our requirements
const fs = require('fs');
const Discord = require('discord.js');

// Import config options requires
const { Prefix, Token } = require('./config.json');

// Create discord client
const client = new Discord.Client();

// Import commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

// Startup
client.once('ready', () => {
	console.log('Ready');
});


// Main Program
client.on('message', message => {
	if (!message.content.startsWith(Prefix) || message.author.bot) return;

	const args = message.content.slice(Prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    if (command.args && !args.length) {
        let reply = `You need to provide some parameters ${message.author}! Check below:`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${Prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(Token);