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

        // Display Discord Server info
        [Command("serverinfo")]
        [Description("Displays the Server information your currently in")]
        [Aliases("servinfo", "serverinf")]
        public async Task ServerInfo(CommandContext ctx)
        {
            string boostTier = ctx.Guild.PremiumTier.ToString();

            DiscordEmbed discordEmbed = new DiscordEmbedBuilder()
                .WithTitle(ctx.Guild.Name)
                .WithAuthor(ctx.Message.Author.Username)
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

            DiscordMessage message = await new DiscordMessageBuilder()
                .WithEmbed(discordEmbed)
                .SendAsync(ctx.Channel);
        }
    }

}
