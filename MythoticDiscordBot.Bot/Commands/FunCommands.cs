using DSharpPlus.CommandsNext.Attributes;
using DSharpPlus.CommandsNext;
using DSharpPlus.Entities;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MythoticDiscordBot.Bot.Interfaces;

namespace MythoticDiscordBot.Bot.Commands
{
    public class FunCommands : BaseCommandModule, ICommandCategory
    {
        private readonly Dictionary<string, DateTime> PoorBastards = new();

        public string Category()
        {
            return "Fun";
        }

        [Command("weednuke")]
        [Description(":D")]
        public async Task WeedNuke(CommandContext ctx)
        {
            foreach (KeyValuePair<string, DateTime> bastard in PoorBastards.Where(bastard => DateTime.Now > bastard.Value))
            {
                PoorBastards.Remove(bastard.Key);
            }

            Random random = new((int)DateTime.Now.Ticks);

            DiscordMember origin = ctx.Member;
            DiscordMember poorBastard = ctx.Channel.Users[random.Next(ctx.Channel.Users.Count)];

            if (origin.Username == poorBastard.Username)
            {
                if (PoorBastards.ContainsKey(poorBastard.Username))
                {
                    await ctx.RespondAsync($"**{origin.Username}**, while high, nuked themself, making them even more high!").ConfigureAwait(false);
                    PoorBastards[poorBastard.Username] = DateTime.Now.AddSeconds(300);
                }
                else
                {
                    await ctx.RespondAsync($"**{origin.Username}** launched a weednuke at themself... Idiot.").ConfigureAwait(false);
                    PoorBastards.Add(poorBastard.Username, DateTime.Now.AddSeconds(300));
                }
            }
            else
            {   
                if (PoorBastards.ContainsKey(poorBastard.Username))
                {
                    await ctx.RespondAsync($"**{origin.Username}** launched a weed nuke! It hits **{poorBastard.Username}** making them even more high!").ConfigureAwait(false);
                    PoorBastards.Add(poorBastard.Username, DateTime.Now.AddSeconds(300));
                }
                else
                {
                    await ctx.RespondAsync($"**{origin.Username}** launched a weed nuke! It hits **{poorBastard.Username}** making them high.").ConfigureAwait(false);
                    PoorBastards[poorBastard.Username] = DateTime.Now.AddSeconds(300);
                }
            }
        }
    }
}
