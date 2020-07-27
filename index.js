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
const BotClient = require('./Structures/BotClient');
const config = require('./config.json');

// Create new Bot Client and login
const client = new BotClient(config);
client.start();