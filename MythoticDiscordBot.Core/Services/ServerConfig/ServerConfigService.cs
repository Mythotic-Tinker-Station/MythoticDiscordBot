﻿using System;
using System.Collections.Generic;
using System.Linq;
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
        Task<ServerConfig> GetServerConfigByServerId(string serverId);
        Task CreateServerConfig(ServerConfig config);
        Task UpdateServerConfig_ServerName(ServerConfig config, string value);
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

        public async Task<ServerConfig> GetServerConfigByServerId(string serverId)
        {
            ulong newserverId = Convert.ToUInt64(serverId);
            return await _context.ServerConfigs.FirstOrDefaultAsync(x => x.ServerId == newserverId);

        }

        public async Task UpdateServerConfig_ServerName(ServerConfig config, string value)
        {
            ulong serverId = config.ServerId;
            ServerConfig Config = await _context.ServerConfigs.Where(x => x.ServerId == serverId).FirstOrDefaultAsync();

            if (Config == null)
            {
                throw new Exception("CRITICAL: Server config is not in the database");
            }
            else
            {
                Config.ServerName = value;
                await _context.SaveChangesAsync();
            }
            
        }
    }
}
