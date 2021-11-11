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

        // Display Discord Server info
        [SlashCommand("serverinfo", "Displays the Server information your currently in")]
        public async Task ServerInfo(InteractionContext ctx)
        {
            string boostTier = ctx.Guild.PremiumTier.ToString();

            DiscordEmbed discordEmbed = new DiscordEmbedBuilder()
                .WithTitle(ctx.Guild.Name)
                .WithAuthor(ctx.Member.Username)
                .WithColor(DiscordColor.Cyan)
                .WithImageUrl(ctx.Guild.IconUrl)
                .WithDescription("Server Information")
                .AddField("General", $"**❯ Name:** {ctx.Guild.Name}\n" +
                $"**❯ ID:** {ctx.Guild.Id}\n" +
                $"**❯ Owner:** {ctx.Guild.Owner.Username} ({ctx.Guild.OwnerId})\n" +
                $"**❯ Boost Tier:** {boostTier}\n" +
                $"**❯ Explicit Filter:** {ctx.Guild.ExplicitContentFilter}\n" +
                $"**❯ Verification Level:** {ctx.Guild.VerificationLevel}\n" +
                $"**❯ Time Created:** {ctx.Guild.CreationTimestamp.DateTime}\n")

                .AddField("Stats", $"**❯ Role Count:** {ctx.Guild.Roles.Count}\n" +
                $"**❯ Emoji Count:** {ctx.Guild.Emojis.Count}\n" +
                $"**❯ Members:** {ctx.Guild.Members.Count}\n" +
                $"**❯ Channels:** {ctx.Guild.Channels.Count}\n" +
                $"**❯ Boost Count:** {ctx.Guild.PremiumSubscriptionCount}\n")

                // Add Presence stats later, dont know what prop has them
                .Build();

            await ctx.CreateResponseAsync(InteractionResponseType.ChannelMessageWithSource, new DiscordInteractionResponseBuilder().AddEmbed(discordEmbed));
        }
    }
}
