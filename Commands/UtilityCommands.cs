/* 
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ~ The Mythotic Discord Bot ~
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    UtilityCommands.cs - Utility Command Module

    Contains all commands that are utility such as ping, display server info etc


 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DSharpPlus.CommandsNext;
using DSharpPlus.CommandsNext.Attributes;
using DSharpPlus.Entities;
using DSharpPlus.Interactivity;

namespace MythoticDiscordBot.Commands
{
    public class UtilityCommands : BaseCommandModule
    {
        // Just a Ping Command
        [Command("ping")]
        [Description("It returns pong... How orginial")]
        public async Task Ping(CommandContext ctx)
        {
            await ctx.RespondAsync("Pong").ConfigureAwait(false);
        }
    }
}
