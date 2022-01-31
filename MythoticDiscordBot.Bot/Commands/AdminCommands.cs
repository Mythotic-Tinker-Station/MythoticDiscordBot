using DSharpPlus.CommandsNext.Attributes;
using DSharpPlus.CommandsNext;
using DSharpPlus.Entities;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MythoticDiscordBot.Bot.Interfaces;
using MythoticDiscordBot.DAL;

namespace MythoticDiscordBot.Bot.Commands
{
    public class AdminCommands : BaseCommandModule, ICommandCategory
    {
        public string Category()
        {
            return "Administration";
        }

        private readonly ServerConfigContext _context;

        public AdminCommands(ServerConfigContext context)
        {
            _context = context;
        }


    }
}
