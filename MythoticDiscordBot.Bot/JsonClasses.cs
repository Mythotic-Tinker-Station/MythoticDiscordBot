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

namespace MythoticDiscordBot
{
    internal class JsonClasses
    {

        public class ConfigJson
        {
            public string Token { get; set; }
            public string[] Owners { get; set; }
            public Twitterapi TwitterAPI { get; set; }
            public Twitchapi TwitchAPI { get; set; }
            public Twitchlistener TwitchListener { get; set; }
            public string DatabaseURL { get; set; }
        }

        public class Twitterapi
        {
            public string ApiKey { get; set; }
            public string ApiSecretKey { get; set; }
            public string BearerToken { get; set; }
            public string UserAccessToken { get; set; }
            public string UserAccessTokenSecret { get; set; }
        }

        public class Twitchapi
        {
            public string ClientId { get; set; }
            public string ClientSecret { get; set; }
        }

        public class Twitchlistener
        {
            public string HostName { get; set; }
            public string ListenerPort { get; set; }
        }

    }
}
