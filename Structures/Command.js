/*
    ---------------------------------------------------------------------
    ---------------------------------------------------------------------
    ----------              Mythotic Tinker bot                ----------
    ---------------------------------------------------------------------
    ---------------------------------------------------------------------

    Command.js

    This file the base class for commands. Each command should be extending
    this class in order for it to work.
*/

module.exports = class Command {

    constructor(client, name, options = {}) {
        this.client = client;
        this.name = options.name || name;
        this.aliases = options.aliases || [];
        this.description = options.description || 'No description available.';
        this.category = options.category || 'Miscellaneous';
        this.usage = `${this.client.Prefix}${this.name} ${options.usage || ''}`.trim();
        this.permission = options.permission || [];
        this.subcommands = options.subcommands || {};
    }

    async prerun(message, args) {
        try {
            // Check if user does not have admin perms or is on any of the AdminRoles groups.
            if (message.member.hasPermission(this.permission)) {
                await this.run(message, args);
            }
            else {
                await this.noaccess(message, args);
            }

        }
        catch(err) {
            console.error(err);
        }
    }

    // eslint-disable-next-line no-unused-vars
    async noaccess(message, args) {
        throw new Error('User does not have access to this command.');
    }

    // eslint-disable-next-line no-unused-vars
    async run(message, args) {
        throw new Error(`Command ${this.name} does not have a run method. Did you code it correctly?`);
    }
};