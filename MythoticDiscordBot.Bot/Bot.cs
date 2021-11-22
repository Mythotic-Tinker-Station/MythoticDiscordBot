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
using MythoticDiscordBot.Bot.Commands;
using Microsoft.Extensions.DependencyInjection;
using MythoticDiscordBot.Bot.SlashCommands;
using MythoticDiscordBot.Core.Services.ServerConfigService;

namespace MythoticDiscordBot.Bot
{
    class BotClient
    {
        static EventLogic events;
        public DiscordClient discord { get; private set; }
        public InteractivityExtension Interactivity { get; private set; }
        public CommandsNextExtension Commands { get; private set; }
        public SlashCommandsExtension SlashCommands { get; private set; }

        public BotClient(IServiceProvider services, ConfigJson config)
        {
            // Setup the Discord Client
            DiscordConfiguration DiscordConfig = new(new()
            {
                Token = config.Token,
                TokenType = TokenType.Bot,
                Intents = DiscordIntents.All
            });

            DiscordClient discord = new(DiscordConfig);

            // Interactivity Setup
            discord.UseInteractivity(new InteractivityConfiguration
            {
                Timeout = TimeSpan.FromMinutes(2)
            });

            // Command Initization
            CommandsNextConfiguration commandsConfig = new()
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
            SlashCommandsConfiguration slashCommandsConfig = new()
            {
                Services = services
            };

            SlashCommands = discord.UseSlashCommands(slashCommandsConfig);
            SlashCommands.RegisterCommands<UtilitySlashCmds>(456744423343128597);

            Program.ConfigService = services.GetService<IServerConfigService>();

            // Events Initization
            events = new(discord);

            // Start the bot!
            discord.ConnectAsync();
            Task.Delay(-1);
        }

    }
}