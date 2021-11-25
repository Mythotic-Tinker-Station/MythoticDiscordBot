/* 
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ~ The Mythotic Discord Bot ~
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    CommandUtils.cs - Command Utilities

    Contains useful methods and variables for commands.


 */

using DSharpPlus;
using DSharpPlus.CommandsNext;
using DSharpPlus.Entities;
using DSharpPlus.SlashCommands;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace MythoticDiscordBot.Bot.Utilities
{
    internal class CommandUtils
    {
        public static DiscordEmbed GetServerInfo(DiscordGuild guild, DiscordMember member)
        {
            return new DiscordEmbedBuilder()
                .WithTitle(guild.Name)
                .WithAuthor(member.Username)
                .WithColor(DiscordColor.Cyan)
                .WithThumbnail(guild.IconUrl)
                .WithDescription("Server Information")
                .AddField("General", $"**❯ Name:** {guild.Name}\n" +
                $"**❯ ID:** {guild.Id}\n" +
                $"**❯ Owner:** {guild.Owner.Username} ({guild.OwnerId})\n" +
                $"**❯ Boost Tier:** {guild.PremiumTier}\n" +
                $"**❯ Explicit Filter:** {guild.ExplicitContentFilter}\n" +
                $"**❯ Verification Level:** {guild.VerificationLevel}\n" +
                $"**❯ Time Created:** {guild.CreationTimestamp.DateTime}\n")

                .AddField("Stats", $"**❯ Role Count:** {guild.Roles.Count}\n" +
                $"**❯ Emoji Count:** {guild.Emojis.Count}\n" +
                $"**❯ Members:** {guild.Members.Count}\n" +
                $"**❯ Channels:** {guild.Channels.Count}\n" +
                $"**❯ Boost Count:** {guild.PremiumSubscriptionCount}\n")

                // Add Presence stats later, dont know what prop has them
                .Build();
        }

        public static DiscordEmbed GetUserInfo(DiscordMember member)
        {
            return new DiscordEmbedBuilder()
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
            $"**❯ Game:** {member.Presence.Activity.Name ?? "Not Doing anything right now"}\n")

            .AddField("Member Details", $"**❯ Server Join Date:** {member.JoinedAt.DateTime}\n" +
            $"**❯ Roles [{member.Roles.Count()}]:**\n{string.Join('\n', member.Roles.Select(role => $"**❯❯** {role.Mention}"))}")

            .Build();
        }

        public static DiscordEmbed GetBotInfo(DiscordClient client, CommandsNextExtension cne = null, SlashCommandsExtension sce = null)
        {
            if (cne == null && sce == null)
            {
                throw new Exception("CommandsNextExtension and SlashCommandsExtension are null.");
            }

            // First lets make things easy by getting some stats about the bot
            int commandCount = cne != null ? cne.RegisteredCommands.Count : sce.RegisteredCommands.Count; // This should be the same number as slash commands, if not, each command needs a slash command ver
            int serverCount = client.Guilds.Count;
            // Get a total USER count **Future Feature**
            // Get a total Channels count **Future Feature**
            DateTime creationDate = client.CurrentUser.CreationTimestamp.DateTime;

            return new DiscordEmbedBuilder()
                .WithTitle("Afina the Archmage")
                .WithDescription("Magic and Technology, together at last. - Powered by The Mythotic Bot - v0.1")
                .WithThumbnail(client.CurrentUser.AvatarUrl)
                .WithUrl("https://github.com/Mythotic-Tinker-Station/MythoticDiscordBot")
                .WithColor(DiscordColor.Gold)

                .AddField("General Info",
                $"**❯ Client:** {client.CurrentUser.Username} ({client.CurrentUser.Id})\n" +
                $"**❯ Commands:** {commandCount}\n" +
                $"**❯ Servers:** {serverCount}\n" +
                $"**❯ Creation Date:** {creationDate}\n" +
                $"**❯ Uptime:** {DateTime.Now - Program.ReadyTime:d\\:hh\\:mm\\:ss}\n" +
                $"**❯ .NET Version:** {RuntimeInformation.FrameworkDescription}\n" +
                $"**❯ DSharpPlus Version:** {client.VersionString}\n")

                .AddField("System Information", "Coming Soon\n")

                .AddField("The Mythotic TinkerStation Team",
                $"**❯ Project Lead:** {client.GetUserAsync(171142963550879744).Result.Username}#{client.GetUserAsync(171142963550879744).Result.Discriminator}\n" +
                $"**❯ Developers:** {client.GetUserAsync(132765406468243456).Result.Username}#{client.GetUserAsync(132765406468243456).Result.Discriminator}, {client.GetUserAsync(225665151993511937).Result.Username}#{client.GetUserAsync(225665151993511937).Result.Discriminator}\n" +
                $"**❯ Contributers:** {client.GetUserAsync(175250564764925952).Result.Username}#{client.GetUserAsync(175250564764925952).Result.Discriminator}")

                .AddField("Support Information", $"**❯ Discord Server:** [\\[Join our Discord!\\]](https://discord.gg/afinaslexicon)")

                .Build();
        }

        public static void BanUser()
        {

        }
    }
}
