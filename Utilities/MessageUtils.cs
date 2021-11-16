using DSharpPlus.Entities;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MythoticDiscordBot.Utilities
{
    internal class MessageUtils
    {
        public static async Task SendMessage(DiscordChannel channel, DiscordEmbed embed) => await new DiscordMessageBuilder().WithEmbed(embed).SendAsync(channel);
    }
}
