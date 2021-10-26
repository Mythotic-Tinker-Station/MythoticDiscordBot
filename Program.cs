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
using Newtonsoft.Json.Linq;

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
            JObject config = JObject.Parse(File.ReadAllText("Config\\config.json"));
            
            // Setup the Discord Client
            var discord = new DiscordClient(new DiscordConfiguration()
            {
                Token = (string)config.GetValue("Token"),
                TokenType = TokenType.Bot,
                Intents = DiscordIntents.All
            });

            await discord.ConnectAsync();
            await Task.Delay(-1);
        }
    }
}