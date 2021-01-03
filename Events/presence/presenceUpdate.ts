import { Event } from '../../Structures/Event';

module.exports = class extends (Event) {
    constructor(client) {
        const name = 'presenceUpdate';
        const options = {
			name: 'presenceUpdate',
			type: 'on',
        };
        const howManyArgs = 2
        
        super(client, name, options, howManyArgs);
    }

    async run(oldPresence, newPresence) {
        // Handle each presence type here when required. Obviously streaming first :)
        if (!newPresence.activities) return false;
        for (const activity of newPresence.activities) {
            if (activity.type == "STREAMING") {
                console.log(`${newPresence.user.tag} is streaming at ${activity.url}.`);

                // We need to determine if the user is in a server where they have the streaming settings configured
                
            };
        }
    }
}