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
using MythoticDiscordBot.Bot.Utilities;
using DSharpPlus.Exceptions;

namespace MythoticDiscordBot.Bot.Commands
{
    public class UtilityCommands : BaseCommandModule
    {
        // Just a Ping Command
        [Command("ping")]
        [Description("Get ping times for the bot")]
        public async Task Ping(CommandContext ctx)
        {
            await ctx.RespondAsync($"**Ping Time:** {ctx.Client.Ping}");
        }

        // Display Discord Server info
        [Command("serverinfo")]
        [Description("Displays the Server information your currently in")]
        [Aliases("servinfo", "serverinf")]
        public async Task ServerInfo(CommandContext ctx)
        {
            await new DiscordMessageBuilder()
                .WithEmbed(CommandUtils.GetServerInfo(ctx.Guild, ctx.Member))
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
                await new DiscordMessageBuilder()
                    .WithContent("This Command requires a User in order to run")
                    .SendAsync(ctx.Channel);
            }
            else
            {
                await new DiscordMessageBuilder()
                    .WithEmbed(CommandUtils.GetUserInfo(input[0]))
                    .SendAsync(ctx.Channel);
            }

        }

        // Display bot information
        [Command("botinfo")]
        [Description("Displays information about ME! (The bot)")]
        [Aliases("info", "bot")]
        public async Task BotInfo(CommandContext ctx)
        {
            await MessageUtils.SendMessage(ctx.Channel, CommandUtils.GetBotInfo(ctx.Client, ctx.CommandsNext));
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

                await new DiscordMessageBuilder().WithContent(output == null ? "*null*" : output.ToString()).SendAsync(ctx.Channel);
            }
        }

        // Ban someone
        [Command("ban")]
        [Description("Ban a user")]
        public async Task Ban(CommandContext ctx, DiscordMember user, params string[] reason)
        {
            try
            {
                await ctx.Guild.BanMemberAsync(user, reason: reason.Length > 0 ? string.Join(' ', reason) : "No reason specified.");

                new DiscordEmbedBuilder()
                    .WithColor(DiscordColor.Red)
                    .WithAuthor("!!!WARNING!!! A user has been BANNED")
                    .WithThumbnail("https://png2.cleanpng.com/sh/c9e9df36b83579a2c9964faa72ba5bd5/L0KzQYm3VcE0N5hqiZH0aYP2gLBuTfhidZ5qip9wYX3oPcHsjwNqd58yitdBaXX6Pbr1lPVzdpZ5RdV7b4X3f7A0VfFnQGFqUKVuZUi7Roi1VcEzOGo9TKI6NUK5QoG9UMg0QWg8RuJ3Zx==/kisspng-hammer-game-pension-review-internet-crouton-5af80e83ee8867.512098401526206083977.png")
                    .WithFooter($"Action requested by ${ctx.Message.Author.Mention}")
                    .WithTimestamp(DateTime.UtcNow)
                    .Build();
            }
            catch (Exception ex)
            {
                if (ex is UnauthorizedException)
                {
                    await ctx.RespondAsync($"{user.Username} is not able to be banned by me!");
                }
                else if (ex is NotFoundException)
                {
                    await ctx.RespondAsync($"{user.Username} is not a member of this guild.");
                }
                else
                {
                    await ctx.Channel.SendMessageAsync($"**Error banning user:**\n```{ex.Message}```");
                }
            }
        }

        [Command("ban")]
        [Description("Ban a user")]
        public async Task Ban(CommandContext ctx)
        {
            await ctx.Channel.SendMessageAsync($"No user specified.");
        }
    }
}
