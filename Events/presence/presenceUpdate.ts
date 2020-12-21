import { Presence } from 'discord.js';
import { Event } from '../../Structures/Event';

module.exports = class extends (Event) {
    constructor(client) {
        const name = 'presenceUpdate';
        const options = {
			name: 'presenceUpdate',
			type: 'on',
        };
        
        super(client, name, options);
    }

    async run(oldPresence, newPresence) {
        if (!newPresence.activities) return false;
        newPresence.activities.forEach(activity => {
            if (activity.type == "STREAMING") {
                //Streaming handler
                console.log(`${newPresence.user.tag} is streaming at ${activity.url}.`);

                // Need to determine if the user is in a discord server with streaming enabled
            };
        });
    }
}