using DSharpPlus;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MythoticDiscordBot.DAL.Models.ServerConfig;
using MythoticDiscordBot.Core.Services.ServerConfigService;
using DSharpPlus.EventArgs;

namespace MythoticDiscordBot.Bot.Events
{
    public class GuildCreated
    {
        public static async Task Discord_GuildCreated(DiscordClient client, GuildCreateEventArgs guild)
        {
            ServerConfig serverConfig = Program.ConfigService.Context.ServerConfigs.SingleOrDefault(c => c.ServerId == guild.Guild.Id);

            if (serverConfig == null)
            {
                // First, lets build an ServerConfig
                ServerConfig newConfig = new()
                {
                    ServerId = guild.Guild.Id,
                    ServerName = guild.Guild.Name,
                    Prefix = "!"
                };

                try
                {
                    await Program.ConfigService.CreateServerConfig(newConfig);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                }
            }
        }
    }
}
