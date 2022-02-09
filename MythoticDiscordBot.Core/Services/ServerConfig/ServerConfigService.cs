using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

using MythoticDiscordBot.DAL;
using MythoticDiscordBot.DAL.Models.ServerConfig;

namespace MythoticDiscordBot.Core.Services.ServerConfigService
{
    public interface IServerConfigService
    {
        ServerConfigContext Context { get; }
        Task<ServerConfig> GetServerConfigByServerId(ulong serverId);
        Task CreateServerConfig(ServerConfig config);
        Task UpdateServerConfig(ServerConfig config, string setting, string value);
        //Task DeleteServerConfig(ServerConfig config);
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

        public async Task<ServerConfig> GetServerConfigByServerId(ulong serverId)
        {
            return await _context.ServerConfigs.FirstOrDefaultAsync(x => x.ServerId == serverId);

        }

        public async Task UpdateServerConfig(ServerConfig config, string setting, string value)
        {
            if (config == null)
            {
                throw new Exception("CRITICAL: Server config is not in the database");
            }


            PropertyInfo info = config.GetType().GetProperty(setting);
            if (info == null)
            {
                throw new Exception("CRITICAL: Invalid variable name");
            }

            _context.Update(config);
            info.SetValue(config, value);
            await _context.SaveChangesAsync();
        } 
    }
}
