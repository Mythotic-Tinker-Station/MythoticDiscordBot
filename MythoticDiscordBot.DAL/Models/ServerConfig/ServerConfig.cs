using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace MythoticDiscordBot.DAL.Models.ServerConfig
{
    public class ServerConfig : Entity
    {
        public ulong ServerId { get; set; }
        public string ServerName { get; set; }
        public string? AdminRole { get; set; }
        public string? ModeratorRole { get; set; }
        public string Prefix { get; set; }
    }
}
