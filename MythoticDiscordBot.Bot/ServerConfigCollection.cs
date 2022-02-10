/* 
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ~ The Mythotic Discord Bot ~
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    JSON Classes. Required for storing configs or Values


 */


using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MythoticDiscordBot.Bot
{
    internal class ServerConfigCollection
    {

        public class ServerConfigJson
        {
            public ulong ServerId { get; set; }
            public string ServerName { get; set; }
            public string? AdminRole { get; set; }
            public string? ModeratorRole { get; set; }
            public string Prefix { get; set; }
        }
    }
}
