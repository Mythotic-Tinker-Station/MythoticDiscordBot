/*
    ---------------------------------------------------------------------
    ---------------------------------------------------------------------
    ----------              Mythotic Tinker bot                ----------
    ---------------------------------------------------------------------
    ---------------------------------------------------------------------

    Event.js

    This file the base class for Event. Each Event should be extending
	this class in order for it to work.
	
	Events should go into the Events folder and they should reflect the
	proper event names on discord and options.

	Check out https://discord.js.org/#/docs/main/12.5.1/class/Client for the list of valid events
*/

import { BotClient } from './BotClient';

export class Event {
	client: BotClient;
	name: string;
	options?: any;
	type: any;
	emitter?: any;
	howManyArgs?: Number;

	constructor(
		client: BotClient,
		name: string,
		options: any = {},
		howManyArgs?: Number
	) {
		this.client = client;
		this.name = name;
		this.type = options.once ? 'once' : 'on';
		this.howManyArgs = howManyArgs;
		this.emitter =
			(typeof options.emitter === 'string'
				? this.client[options.emitter]
				: options.emitter) || this.client;
	}

	// eslint-disable-next-line no-unused-vars
	run(args: any, secondaryArgs?: any) {
		throw new Error(
			`The run method has not been implemented in ${this.options.name}`
		);
	}
}
