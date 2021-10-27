/* 
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ~ The Mythotic Discord Bot ~
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    Main file - Contains the initalization for the bot


 */

using DSharpPlus;
using System;
using System.Threading.Tasks;
using System.IO;
using System.Text.Json;
using static MythoticDiscordBot.JsonClasses;
using MythoticDiscordBot;

namespace MythoticBot
{
    class Program
    {
        static EventLogic events;

        static async Task Main(string[] args)
        {
            // First, lets read the config!
            ConfigJson config = JsonSerializer.Deserialize<ConfigJson>(File.ReadAllText("Config\\config.json"));

            // Setup the Discord Client
            DiscordClient discord = new(new()
            {
                Token = config.Token,
                TokenType = TokenType.Bot,
                Intents = DiscordIntents.All
            });

            CommandLogic.SetCommand("test", "Testing!");
            events = new(discord);

            await discord.ConnectAsync();
            await Task.Delay(-1);
        }
    }
}