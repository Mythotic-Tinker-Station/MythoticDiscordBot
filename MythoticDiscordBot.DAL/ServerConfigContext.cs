using Microsoft.EntityFrameworkCore;
using MythoticDiscordBot.DAL.Models.ServerConfig;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MythoticDiscordBot.DAL
{
    public class ServerConfigContext : DbContext
    {
        public ServerConfigContext(DbContextOptions<ServerConfigContext> options) : base(options) { }

        public DbSet<ServerConfig> ServerConfigs { get; set; }
    }
}
