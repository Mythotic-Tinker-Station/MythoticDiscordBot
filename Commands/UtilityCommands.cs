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
using MythoticDiscordBot.Utilities;

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
            await new DiscordMessageBuilder()
                    .WithEmbed(CommandUtils.GetBotInfo(ctx.Client, ctx.CommandsNext))
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

                await new DiscordMessageBuilder().WithContent(output == null ? "*null*" : output.ToString()).SendAsync(ctx.Channel);
            }
        }
    }
}
