/* 
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ~ The Mythotic Discord Bot ~
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    Main file - Contains the initalization for the bot

    To Edit events please check the Events Folder. For Commands, the Commands Folder.


 */

using DSharpPlus;
using System;
using System.Threading.Tasks;
using System.IO;
using System.Text.Json;
using static MythoticDiscordBot.Bot.JsonClasses;
using MythoticDiscordBot;
using DSharpPlus.EventArgs;
using DSharpPlus.Interactivity.Extensions;
using DSharpPlus.Interactivity;
using DSharpPlus.CommandsNext;
using DSharpPlus.SlashCommands;
using MythoticDiscordBot.Commands;
using Microsoft.Extensions.DependencyInjection;
using MythoticDiscordBot.SlashCommands;

namespace MythoticDiscordBot.Bot
{
    class BotClient
    {
        static EventLogic events;
        public DiscordClient discord { get; private set; }
        public InteractivityExtension Interactivity { get; private set; }
        public CommandsNextExtension Commands { get; private set; }
        public SlashCommandsExtension SlashCommands {  get; private set; }

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

            // Interactivity Setup
            discord.UseInteractivity(new InteractivityConfiguration
            {
                Timeout = TimeSpan.FromMinutes(2)
            });

            // Command Initization
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
            Commands.RegisterCommands<FunCommands>();

            // Slash Commands Initization
            SlashCommandsConfiguration slashCommandsConfig = new SlashCommandsConfiguration
            {
                Services = services,
                
            };

            SlashCommands = discord.UseSlashCommands(slashCommandsConfig);
            SlashCommands.RegisterCommands<UtilitySlashCmds>(guildId: 456744423343128597);

            // Events Initization
            events = new(discord);

            // Start the bot!
            await discord.ConnectAsync();
            await Task.Delay(-1);

        }

    }
}