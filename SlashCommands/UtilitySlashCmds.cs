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

using MythoticDiscordBot.Utilities;

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

        // Display Discord Server info
        [SlashCommand("serverinfo", "Displays the Server information your currently in")]
        public async Task ServerInfo(InteractionContext ctx)
        {
            await ctx.CreateResponseAsync(InteractionResponseType.ChannelMessageWithSource, new DiscordInteractionResponseBuilder()
                .AddEmbed(CommandUtils.GetServerInfo(ctx.Guild, ctx.Member)));
        }

        // Display Userinfo for the person who runs the command or the user passed in as an argument
        [SlashCommand("usrinfo", "Display User Information for users in the server (or yourself)")]
        public async Task UserInfo(InteractionContext ctx, [Option("user", "The user you want info on")] DiscordUser user)
        {
            await ctx.CreateResponseAsync(InteractionResponseType.ChannelMessageWithSource, new DiscordInteractionResponseBuilder()
                .AddEmbed(CommandUtils.GetUserInfo((DiscordMember)user)));
        }
    }
}
