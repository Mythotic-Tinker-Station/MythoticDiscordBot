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

namespace MythoticBot
{
    class Program
    {
        static void Main(string[] args)
        {
            MainAsync().GetAwaiter().GetResult();
        }

        static async Task MainAsync()
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

            await discord.ConnectAsync();
            await Task.Delay(-1);
        }
    }
}