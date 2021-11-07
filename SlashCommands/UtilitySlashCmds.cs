/* 
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ~ The Mythotic Discord Bot ~
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    UtilitySlashCmds.cs - Utility Slash Command Module

    Contains all commands that are utility such as ping, display server info etc. This should be an exact mirror of the Commands Class


 */


using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DSharpPlus;
using DSharpPlus.CommandsNext;
using DSharpPlus.CommandsNext.Attributes;
using DSharpPlus.Entities;
using DSharpPlus.SlashCommands;
using DSharpPlus.SlashCommands.Attributes;

namespace MythoticDiscordBot.SlashCommands
{
    public class UtilitySlashCmds : ApplicationCommandModule
    {
        // Just a Ping Command
        [SlashCommand("ping", "A Test command")]
        public async Task Ping(InteractionContext ctx)
        {
            await ctx.CreateResponseAsync(InteractionResponseType.ChannelMessageWithSource, new DiscordInteractionResponseBuilder().WithContent("Pong"));
        }
    }
}
