﻿/* 
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
using DSharpPlus.EventArgs;
using DSharpPlus.Interactivity.Extensions;
using DSharpPlus.Interactivity;
using DSharpPlus.CommandsNext;
using MythoticDiscordBot.Commands;
using Microsoft.Extensions.DependencyInjection;

namespace MythoticDiscordBot.Bot
{
    class BotClient
    {
        static EventLogic events;
        public DiscordClient discord { get; private set; }
        public InteractivityExtension Interactivity { get; private set; }
        public CommandsNextExtension Commands { get; private set; }

        public async Task RunAsync()
        {
            // First, lets read the config!
            ConfigJson config = JsonSerializer.Deserialize<ConfigJson>(File.ReadAllText("Config\\config.json"));

            // Setup the Discord Client
            DiscordConfiguration DiscordConfig = new(new()
            {
                Token = config.Token,
                TokenType = TokenType.Bot,
                Intents = DiscordIntents.All
            });

            DiscordClient discord = new(DiscordConfig);

            // Create a Service Provider
            // https://dsharpplus.github.io/articles/commands/dependency_injection.html
            // Add any types to the service provider when required
            ServiceProvider services = new ServiceCollection()
                .AddSingleton<Random>()
                .BuildServiceProvider();

            discord.UseInteractivity(new InteractivityConfiguration
            {
                Timeout = TimeSpan.FromMinutes(2)
            });

            CommandsNextConfiguration commandsConfig = new CommandsNextConfiguration
            {
                StringPrefixes = new string[] { "!" },
                EnableDms = false,
                EnableMentionPrefix = true,
                DmHelp = true,
                Services = services
            };

            Commands = discord.UseCommandsNext(commandsConfig);

            Commands.RegisterCommands<UtilityCommands>();

            //CommandLogic.SetCommand("test", "Testing!");
            events = new(discord);

            await discord.ConnectAsync();
            await Task.Delay(-1);

        }

    }
}