/*
    ---------------------------------------------------------------------
    ---------------------------------------------------------------------
    ----------              Mythotic Tinker bot                ----------
    ---------------------------------------------------------------------
    ---------------------------------------------------------------------

    Command.js

    This file the base class for commands. Each command should be extending
	this class in order for it to work.

	Each Command will need CommandOptions, as shown below
	
	Commands will also need to pass the following parameters in their run() function.
		- message: The discord message itself
		- args: This will usually be the command name or names if a command has a sub command
		- filteredTokens: Optional, but this is used if a command needs additional arguments
*/

import { BotClient } from './BotClient';

export interface CommandOptions {
	name: string; // Name of the command
	aliases: Array<string>; // Extra names people can use instead
	description: string; // What does the command do?
	category: string; // Command Category
	usage?: string; // Optional, if required to explain how the command is used
	permission?: Array<string>; // Optional, Discord permission required. In future the bot will be able to add roles as admins instead
	subcommands?: any; // Optional, if arguments in a command are supposed to act as sub commands, and if so what they do.
}

export class Command {
	client: BotClient;
	name: string;
	options: CommandOptions;
	args: any;

	constructor(
		client: BotClient,
		name: string,
		options: CommandOptions,
		args
	) {
		this.client = client;
		this.name = name;
		this.options = options;
		this.args = args;
	}

	// Permissions checker
	async prerun(
		message: any,
		args: Array<String>,
		filteredTokens?: Array<String>
	) {
		try {
			// Check if user does not have admin perms or is on any of the AdminRoles groups.
			if (message.member.hasPermission(this.options.permission)) {
				if (this.options.subcommands) {
					await this.run(message, args[0], filteredTokens);
				} else {
					await this.run(message, args, filteredTokens);
				}
			} else {
				await this.noaccess(message, args);
			}
		} catch (err) {
			console.error(err);
		}
	}

	// eslint-disable-next-line no-unused-vars
	// If the user does not have access, this function will run
	async noaccess(message: any, args: any) {
		throw new Error('User does not have access to this command.');
	}

	// eslint-disable-next-line no-unused-vars
	// The run function
	async run(message: any, args: any, filteredTokens?: Array<String>) {
		throw new Error(
			`Command ${this.options.name} does not have a run method. Did you code it correctly?`
		);
	}
}
