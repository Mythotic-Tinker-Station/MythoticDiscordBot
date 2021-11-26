/* 
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ~ The Mythotic Discord Bot ~
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    ModCommands.cs - Moderation Command Module

    Contains commands that are used for server moderation


 */

using DSharpPlus.CommandsNext.Attributes;
using DSharpPlus.CommandsNext;
using DSharpPlus.Entities;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DSharpPlus.Exceptions;
using MythoticDiscordBot.Bot.Utilities;

namespace MythoticDiscordBot.Bot.Commands
{
    internal class ModCommands : BaseCommandModule
    {
        // Ban command
        [Command("ban")]
        [Description("Ban a user from your discord server.")]
        public async Task Ban(CommandContext ctx)
        {
            await ctx.RespondAsync($"No user specified.");
        }

        [Command("ban")]
        [Aliases("banhammer", "banuser")]
        [Description("Ban a user from your discord server.")]
        public async Task Ban(CommandContext ctx, DiscordMember user, params string[] reason)
        {
            try
            {
                await ctx.Guild.BanMemberAsync(user, reason: reason.Length > 0 ? string.Join(' ', reason) : "No reason specified.");

                await MessageUtils.SendMessage(ctx.Channel,
                    new DiscordEmbedBuilder()
                    .WithColor(DiscordColor.Red)
                    .WithAuthor("!!!WARNING!!! A user has been BANNED")
                    .WithThumbnail("https://png2.cleanpng.com/sh/c9e9df36b83579a2c9964faa72ba5bd5/L0KzQYm3VcE0N5hqiZH0aYP2gLBuTfhidZ5qip9wYX3oPcHsjwNqd58yitdBaXX6Pbr1lPVzdpZ5RdV7b4X3f7A0VfFnQGFqUKVuZUi7Roi1VcEzOGo9TKI6NUK5QoG9UMg0QWg8RuJ3Zx==/kisspng-hammer-game-pension-review-internet-crouton-5af80e83ee8867.512098401526206083977.png")
                    .WithFooter($"Action requested by {ctx.Message.Author.Mention}")
                    .WithTimestamp(DateTime.UtcNow)
                    .Build());
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
                    await ctx.RespondAsync($"**Error banning user:**\n```{ex}```");
                }
            }
        }

        // Hackban command
        [Command("hackban")]
        [Description("Ban a user from your discord server if they are not already in the server. (Hackban/Shadowban)")]
        public async Task HackBan(CommandContext ctx)
        {
            await ctx.RespondAsync($"No user ID specified.");
        }

        [Command("hackban")]
        [Aliases("shadowban")]
        [Description("Ban a user from your discord server if they are not already in the server. (Hackban/Shadowban)")]
        public async Task HackBan(CommandContext ctx, params string[] args)
        {
            try
            {
                await ctx.Guild.BanMemberAsync((DiscordMember)ctx.Client.GetUserAsync(Convert.ToUInt64(args[0])).Result, reason: args.Length > 1 ? string.Join(' ', args.Skip(1)) : "No reason specified.");

                await MessageUtils.SendMessage(ctx.Channel,
                    new DiscordEmbedBuilder()
                    .WithColor(DiscordColor.Red)
                    .WithAuthor("!!!WARNING!!! A user has been BANNED")
                    .WithThumbnail("https://png2.cleanpng.com/sh/c9e9df36b83579a2c9964faa72ba5bd5/L0KzQYm3VcE0N5hqiZH0aYP2gLBuTfhidZ5qip9wYX3oPcHsjwNqd58yitdBaXX6Pbr1lPVzdpZ5RdV7b4X3f7A0VfFnQGFqUKVuZUi7Roi1VcEzOGo9TKI6NUK5QoG9UMg0QWg8RuJ3Zx==/kisspng-hammer-game-pension-review-internet-crouton-5af80e83ee8867.512098401526206083977.png")
                    .WithFooter($"Action requested by {ctx.Message.Author.Mention}")
                    .WithTimestamp(DateTime.UtcNow)
                    .Build());
            }
            catch (Exception ex)
            {
                if (ex is NotFoundException)
                {
                    await ctx.RespondAsync("Invalid User ID.");
                }
                else
                {
                    await ctx.RespondAsync($"**Error banning user:**\n```{ex}```");
                }
            }
        }

        // Kick command
        [Command("kick")]
        [Description("Kick a user from your discord server.")]
        public async Task Kick(CommandContext ctx)
        {
            await ctx.RespondAsync($"No user specified.");
        }

        [Command("kick")]
        [Aliases("boot", "kickuser", "removeuser")]
        [Description("Kick a user from your discord server.")]
        public async Task Kick(CommandContext ctx, DiscordMember user, params string[] reason)
        {
            try
            {
                await user.RemoveAsync(reason.Length > 0 ? string.Join(' ', reason) : "No reason specified.");

                await MessageUtils.SendMessage(ctx.Channel,
                    new DiscordEmbedBuilder()
                    .WithColor(DiscordColor.Red)
                    .WithAuthor("!!!WARNING!!! A user has been kicked!")
                    .WithThumbnail("https://cdn.icon-icons.com/icons2/564/PNG/512/Action_2_icon-icons.com_54220.png")
                    .WithFooter($"Action requested by {ctx.Message.Author.Mention}")
                    .WithTimestamp(DateTime.UtcNow)
                    .Build());
            }
            catch (Exception ex)
            {
                if (ex is UnauthorizedException)
                {
                    await ctx.RespondAsync($"{user.Username} is not able to be kicked by me!");
                }
                else if (ex is NotFoundException)
                {
                    await ctx.RespondAsync($"{user.Username} is not a member of this guild.");
                }
                else
                {
                    await ctx.RespondAsync($"**Error kicking user:**\n```{ex}```");
                }
            }
        }
    }
}
