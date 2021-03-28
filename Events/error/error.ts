import { Event } from '../../Structures/Event';
module.exports = class extends (
	Event
) {
	constructor(client) {
		const name = 'error';
		const options = {
			name: 'error',
			type: 'on',
		};

		super(client, name, options);
	}

	async run(error) {
		//console.log(error)
	}
};