using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using static MythoticDiscordBot.Bot.JsonClasses;
using MythoticDiscordBot.DAL;
using System.Text.Json;

namespace MythoticDiscordBot.Bot
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            // First, lets read the config!
            ConfigJson config = JsonSerializer.Deserialize<ConfigJson>(File.ReadAllText("Config\\config.json"));

            services.AddDbContext<ServerConfigContext>(options =>
            {
                options.UseSqlServer(config.DatabaseURL,
                    x => x.MigrationsAssembly("MythoticDiscordBot.DAL.Migrations"));
            });
            
            ServiceProvider serviceProvider = services.BuildServiceProvider();

            BotClient botClient = new BotClient(serviceProvider, config);
            services.AddSingleton(botClient);
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

        }
    }
}
