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
using DSharpPlus;
using MythoticDiscordBot;
using DSharpPlus.CommandsNext;
using DSharpPlus.CommandsNext.Attributes;
using DSharpPlus.Entities;
using DSharpPlus.Interactivity;

using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;
using System.Runtime.InteropServices;

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
                .WithThumbnail(ctx.Guild.IconUrl)
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

        // Display Userinfo for the person who runs the command or the user passed in as an argument
        [Command("userinfo")]
        [Description("Display User Information for users in the server (or yourself)")]
        [Aliases("user", "ui")]
        public async Task UserInfo(CommandContext ctx, params DiscordMember[] input)
        {
            if (input.Length == 0)
            {
                DiscordMessage errorMessage = await new DiscordMessageBuilder()
                    .WithContent("This Command requires a User in order to run")
                    .SendAsync(ctx.Channel);
            }
            else
            {
                DiscordMember member = input[0];

                // Check if the user being queried is doing anything
                string Game = member.Presence.Activity.Name ?? "Not Doing anything right now";

                DiscordEmbed discordEmbed = new DiscordEmbedBuilder()
                .WithTitle($"User Information for {member.DisplayName}")
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

                DiscordMessage message = await new DiscordMessageBuilder()
                    .WithEmbed(discordEmbed)
                    .SendAsync(ctx.Channel);
            }

        }

        // Display bot information
        [Command("botinfo")]
        [Description("Displays information about ME! (The bot)")]
        [Aliases("info", "bot")]
        public async Task BotInfo (CommandContext ctx)
        {
            // First lets make things easy by getting some stats about the bot
            int commandCount = ctx.CommandsNext.RegisteredCommands.Count(); // This should be the same number as slash commands, if not, each command needs a slash command ver
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
                $"**❯ Commands:** {commandCount}\n" +
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


            DiscordMessage message = await new DiscordMessageBuilder()
                    .WithEmbed(discordEmbed)
                    .SendAsync(ctx.Channel);
        }


        // Evaluate C# code via command
        [Command("eval")]
        [Description("Evaluate C# Code")]
        public async Task Eval(CommandContext ctx, params string[] input)
        {
            if (input.Length == 0)
            {
                await new DiscordMessageBuilder().WithContent("!eval <code>").SendAsync(ctx.Channel);
            }
            else
            {
                object output;

                try
                {
                    output = await CSharpScript.EvaluateAsync(string.Concat(input), ScriptOptions.Default.WithImports("System"), ctx, typeof(CommandContext));
                }
                catch (CompilationErrorException ex)
                {
                    output = $"```{ex.Message}```";
                }

                await new DiscordMessageBuilder().WithContent(output == null ? "null" : output.ToString()).SendAsync(ctx.Channel);
            }
        }
    }
}
