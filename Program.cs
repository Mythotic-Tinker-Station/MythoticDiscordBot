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

            discord.MessageCreated += Discord_MessageCreated;

            await discord.ConnectAsync();
            await Task.Delay(-1);
        }

        private static Task Discord_MessageCreated(DiscordClient sender, DSharpPlus.EventArgs.MessageCreateEventArgs e)
        {
            Console.WriteLine($"{e.Channel.Name}: {e.Message.Content}");
            if (e.Channel.Name.Equals("discordbot-dev"))
            {
                switch (e.Message.Content)
                {
                    case "test":
                        sender.SendMessageAsync(e.Channel, "Test Successful!");
                        break;
                    case "quit":
                        sender.DisconnectAsync();
                        Environment.Exit(0);
                        break;
                }
            }

            return Task.CompletedTask;
        }
    }
}