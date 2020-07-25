module.exports = {
	name: 'args-info',
    description: 'Information about the arguments provided. This is just some stupid learning command. Will dissappear later',
    args: true,
    usage: '<arg1> <arg2> <etc>',
	execute(message, args) {
		if (args[0] === 'foo') {
			return message.channel.send('bar');
		}

		message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	},
};