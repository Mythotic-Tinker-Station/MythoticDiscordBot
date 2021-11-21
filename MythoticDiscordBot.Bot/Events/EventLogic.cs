/* 
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ~ The Mythotic Discord Bot ~
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    Event Logic file - Contains the logic to handle events


 */

using DSharpPlus;

using MythoticDiscordBot.Bot.Events;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MythoticDiscordBot.Bot
{
    internal class EventLogic
    {
        public EventLogic(DiscordClient discord)
        {
            // Discord's OnReady Event
            discord.Ready += OnReady.Discord_OnReady;
            
            // Message Created Event Mapping
            discord.MessageCreated += MessageCreated.Discord_MessageCreated;

            // Joined a new server
            discord.GuildCreated += GuildCreated.Discord_GuildCreated;
        }
    }
}
