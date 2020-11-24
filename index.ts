/*
    ---------------------------------------------------------------------
    ---------------------------------------------------------------------
    ----------              Mythotic Tinker bot                ----------
    ---------------------------------------------------------------------
    ---------------------------------------------------------------------

    This is the main program of the bot. This file simply just calls the bot.
    Check the file ./Structures/BotClient.js for bot code.
*/

// Require modules and config
import * as fs from 'fs'

import {BotClient} from './Structures/BotClient'
const config = fs.readFileSync('./config.json', 'utf-8');

// Create new Bot Client and login
const client = new BotClient(JSON.parse(config));
client.start();

export default client