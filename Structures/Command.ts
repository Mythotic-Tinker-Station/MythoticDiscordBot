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

import { BotClient } from "./BotClient";

export interface CommandOptions {
    name: string,
    aliases: Array<string>,
    description: string,
    category: string,
    usage?: string,
    permission?: Array<string>,
    subcommands?: {}
}

export class Command {
    client: BotClient;
    name: string;
    options: CommandOptions;
    args: any;

    constructor(client: BotClient, name: string, options: CommandOptions, ...args) {
        this.client = client;
        this.name = name
        this.options = options;
        this.args = args
    }

    async prerun(message: any, args: any) {
        try {
            // Check if user does not have admin perms or is on any of the AdminRoles groups.
            if (message.member.hasPermission(this.options.permission)) {
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
    async noaccess(message: any, args: any) {
        throw new Error('User does not have access to this command.');
    }

    // eslint-disable-next-line no-unused-vars
    async run(message: any, args: any) {
        throw new Error(`Command ${this.options.name} does not have a run method. Did you code it correctly?`);
    }
};