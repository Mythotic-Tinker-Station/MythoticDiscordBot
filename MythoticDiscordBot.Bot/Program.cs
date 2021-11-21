using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Hosting;
using MythoticDiscordBot.Bot;
using MythoticDiscordBot.Core.Services.ServerConfigService;

namespace MythoticDiscordBot.Bot
{
    class Program
    {
        public static DateTime ReadyTime { get; set; }
        public static IServerConfigService ConfigService { get; set; }

        static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            });
    }
}