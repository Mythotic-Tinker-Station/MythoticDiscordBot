using DSharpPlus;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MythoticDiscordBot.DAL.Models.ServerConfig;
using MythoticDiscordBot.Core.Services.ServerConfigService;

namespace MythoticDiscordBot.Bot.Events
{
    public class GuildCreated
    {
        private readonly IServerConfigService _serverConfigService;

        public GuildCreated(IServerConfigService serverConfigService)
        {
            _serverConfigService = serverConfigService;
        }
        
        public async Task Discord_GuildCreated(DiscordClient client, DSharpPlus.EventArgs.GuildCreateEventArgs guild)
        {
            // First, lets build an ServerConfig
            ServerConfig config = new ServerConfig
            {
                ServerId = guild.Guild.Id,
                ServerName = guild.Guild.Name,
                Prefix = "!"
            };

            try
            {
                await _serverConfigService.CreateServerConfig(config);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
            }
            
        }
    }
}
