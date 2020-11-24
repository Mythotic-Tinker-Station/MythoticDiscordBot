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

import { BotClient } from "./BotClient";

export class Event {
    client: BotClient;
    name: string;
    options?: any;
    type: any;
    emitter?: any;

    constructor(client : BotClient, name: string, options: any = {} ) {
        this.client = client;
        this.name = name;
        this.type = options.once ? 'once' : 'on'
        this.emitter = (typeof options.emitter === 'string' ? this.client[options.emitter] : options.emitter) || this.client;
    }

    // eslint-disable-next-line no-unused-vars
    run(args: any) {
        throw new Error(`The run method has not been implemented in ${this.options.name}`);
    }
};