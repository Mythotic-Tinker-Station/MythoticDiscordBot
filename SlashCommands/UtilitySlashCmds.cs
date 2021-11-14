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
using System.Runtime.InteropServices;
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

        // Display Userinfo for the person who runs the command or the user passed in as an argument
        [SlashCommand("usrinfo", "Display User Information for users in the server (or yourself)")]
        public async Task UserInfo(InteractionContext ctx, [Option("user", "The user you want info on")] DiscordUser user)
        {

            DiscordMember member = (DiscordMember)user;

            // Check if the user being queried is doing anything
            string Game = member.Presence.Activity.Name ?? "Not Doing anything right now";

            DiscordEmbed discordEmbed = new DiscordEmbedBuilder()
            .WithTitle($"User Information for {member.Username}")
            .WithThumbnail(member.AvatarUrl)
            .WithColor(DiscordColor.Azure)
            .WithDescription("User Information")

            .AddField("User", $"**❯ Username:** {member.Username}\n" +
            $"**❯ Discriminator:** {member.Discriminator}\n" +
            $"**❯ ID:** {member.Id}\n" +
            $"**❯ Flags:** {member.Flags}\n" +
            $"**❯ Avatar:** [\\[Link to Avatar\\]]({member.AvatarUrl})\n" +
            $"**❯ Time Created:** {member.CreationTimestamp}\n" +
            $"**❯ Status:** {member.Presence.Status}\n" +
            $"**❯ Game:** {Game}\n")


            .AddField("Member Details", $"**❯ Server Join Date:** {member.JoinedAt.DateTime}\n" +
            $"**❯ Roles [{member.Roles.Count()}]:**\n{string.Join('\n', member.Roles.Select(role => $"**❯❯** {role.Mention}"))}")

            .Build();

            await ctx.CreateResponseAsync(InteractionResponseType.ChannelMessageWithSource, new DiscordInteractionResponseBuilder().AddEmbed(discordEmbed));
        }

        // Display bot information
        [SlashCommand("botinfo", "Display Information about ME! (the bot)")]
        public async Task BotInfo(InteractionContext ctx)
        {
            // First lets make things easy by getting some stats about the bot
            int commandCount = ctx.SlashCommandsExtension.RegisteredCommands.Count; // This should be the same number as slash commands, if not, each command needs a slash command ver
            int serverCount = ctx.Client.Guilds.Count();
            // Get a total USER count **Future Feature**
            // Get a total Channels count **Future Feature**
            DateTime creationDate = ctx.Client.CurrentUser.CreationTimestamp.DateTime;

            DiscordEmbed discordEmbed = new DiscordEmbedBuilder()
                .WithTitle("Afina the Archmage")
                .WithDescription("Magic and Technology, together at last. - Powered by The Mythotic Bot - v0.1")
                .WithThumbnail(ctx.Client.CurrentUser.AvatarUrl)
                .WithUrl("https://github.com/Mythotic-Tinker-Station/MythoticDiscordBot")
                .WithColor(DiscordColor.Gold)

                .AddField("General Info", $"**❯ Client:** {ctx.Client.CurrentUser.Username} ({ctx.Client.CurrentUser.Id})\n" +
                $"**❯ Slash Commands:** {commandCount}\n" +
                $"**❯ Servers:** {serverCount}\n" +
                $"**❯ Creation Date:** {creationDate}\n" +
                $"**❯ .NET Version:** {RuntimeInformation.FrameworkDescription}\n" +
                $"**❯ DSharpPlus Version:** 4.2.0 Nightly\n")

                .AddField("System Information", "Coming Soon\n")

                .AddField("The Mythotic TinkerStation Team", $"**❯ Project Lead:** {ctx.Client.GetUserAsync(171142963550879744).Result.Mention}\n" +
                $"**❯ Developers:** {ctx.Client.GetUserAsync(132765406468243456).Result.Mention}, {ctx.Client.GetUserAsync(225665151993511937).Result.Mention}\n" +
                $"**❯ Contributers:** {ctx.Client.GetUserAsync(175250564764925952).Result.Mention}")

                .AddField("Support Information", $"**❯ Discord Server:** [\\[Join our Discord!\\]](https://discord.gg/afinaslexicon)")

                .Build();

            await ctx.CreateResponseAsync(InteractionResponseType.ChannelMessageWithSource, new DiscordInteractionResponseBuilder().AddEmbed(discordEmbed));

        }
    }
}
