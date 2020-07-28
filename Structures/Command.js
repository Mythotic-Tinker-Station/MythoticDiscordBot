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
    }

    // eslint-disable-next-line no-unused-vars
    async run(message, args) {
        throw new Error(`Command ${this.name} does not have a run method. Did you code it correctly?`);
    }
};