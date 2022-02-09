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
using MythoticDiscordBot.Bot.Utilities;

namespace MythoticDiscordBot.Bot
{
    class BotClient
    {
        public static DiscordClient Discord { get; private set; }
        public InteractivityExtension Interactivity { get; private set; }
        public static CommandsNextExtension Commands { get; private set; }
        public static SlashCommandsExtension SlashCommands { get; private set; }

        public BotClient(IServiceProvider services, ConfigJson config)
        {
            // Setup the Discord Client
            DiscordConfiguration DiscordConfig = new()
            {
                Token = config.Token,
                TokenType = TokenType.Bot,
                Intents = DiscordIntents.All
            };

            Discord = new(DiscordConfig);

            // Interactivity Setup
            Discord.UseInteractivity(new InteractivityConfiguration
            {
                Timeout = TimeSpan.FromMinutes(2)
            });

            // Command Initization
            CommandsNextConfiguration commandsConfig = new()
            {
                StringPrefixes = new[] { "!" },
                EnableDms = true,
                EnableMentionPrefix = true,
                DmHelp = false,
                EnableDefaultHelp = false,
                Services = services
            };

            Commands = Discord.UseCommandsNext(commandsConfig);
            Commands.RegisterCommands<UtilityCommands>();
            Commands.RegisterCommands<FunCommands>();
            Commands.RegisterCommands<ModCommands>();
            Commands.RegisterCommands<AdminCommands>();

            // Slash Commands Initization
            SlashCommandsConfiguration slashCommandsConfig = new()
            {
                Services = services
            };

            SlashCommands = Discord.UseSlashCommands(slashCommandsConfig);
            SlashCommands.RegisterCommands<UtilitySlashCmds>(456744423343128597);

            Program.ConfigService = services.GetService<IServerConfigService>();

            // Events Initization
            _ = new EventLogic(Discord);

            // Start the bot!
            Discord.ConnectAsync();
            Task.Delay(-1);
        }
    }
}