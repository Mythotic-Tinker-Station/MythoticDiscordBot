/*
    ---------------------------------------------------------------------
    ---------------------------------------------------------------------
    ----------              Mythotic Tinker bot                ----------
    ---------------------------------------------------------------------
    ---------------------------------------------------------------------

    Event.js

    This file the base class for Event. Each Event should be extending
    this class in order for it to work.
*/

module.exports = class Event {

    constructor(client, name, options = {}) {
        this.name = name;
        this.client = client;
        this.type = options.once ? 'once' : 'on';
        this.emitter = (typeof options.emitter === 'string' ? this.client[options.emitter] : options.emitter) || this.client;
    }

    // eslint-disable-next-line no-unused-vars
    async run(...args) {
        throw new Error(`The run method has not been implemented in ${this.name}`);
    }
};