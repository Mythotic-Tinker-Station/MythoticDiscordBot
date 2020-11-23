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

interface EventOptions {
    name: string,
    type: string,
    emitter: any
}


export class Event {
    client: BotClient;
    options: EventOptions

    constructor(client : BotClient, name: string, options : EventOptions) {
        this.client = client;
        this.options = options;
    }

    // eslint-disable-next-line no-unused-vars
    run(args: any) {
        throw new Error(`The run method has not been implemented in ${this.options.name}`);
    }
};