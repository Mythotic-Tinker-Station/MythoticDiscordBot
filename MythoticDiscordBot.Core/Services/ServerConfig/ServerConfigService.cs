using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MythoticDiscordBot.DAL;
using MythoticDiscordBot.DAL.Models.ServerConfig;

namespace MythoticDiscordBot.Core.Services.ServerConfigService
{
    public interface IServerConfigService
    {
        ServerConfigContext Context { get; }

        Task<ServerConfig> GetServerConfigByServerId(string serverId);
        Task CreateServerConfig(ServerConfig config);
    }

    public class ServerConfigService : IServerConfigService
    {
        private readonly ServerConfigContext _context;
        public ServerConfigContext Context => _context;

        public ServerConfigService(ServerConfigContext context)
        {
            _context = context;
        }

        public async Task CreateServerConfig(ServerConfig config)
        {
            await _context.AddAsync(config);

            await _context.SaveChangesAsync();
        }

        public async Task<ServerConfig> GetServerConfigByServerId(string serverId)
        {
            throw new NotImplementedException();
        }
    }
}
