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

using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;

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

                DiscordEmbed discordEmbed = new DiscordEmbedBuilder()
                .WithTitle($"User Information for {member.DisplayName}")
                .WithThumbnail(member.AvatarUrl)
                .WithColor(DiscordColor.Azure)
                .WithDescription("User Description")

                .AddField("User", $"**❯ Username:** {member.Username}\n" +
                $"**❯ Discriminator:** {member.Discriminator}\n" +
                $"**❯ ID:** {member.Id}\n" +
                $"**❯ Flags:** {member.Flags}\n")

                .Build();

                DiscordMessage message = await new DiscordMessageBuilder()
                    .WithEmbed(discordEmbed)
                    .SendAsync(ctx.Channel);
            }

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
