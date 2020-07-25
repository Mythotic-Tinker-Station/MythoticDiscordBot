module.exports = {
	name: 'ping',
	description: 'Check if the bot is alive!',
	aliases: ['beep', 'hi?', 'alive'],
	execute(message, args) {
		message.channel.send('Pong.');
	},
};