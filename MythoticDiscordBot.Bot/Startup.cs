using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using MythoticDiscordBot.DAL;

namespace MythoticDiscordBot.Bot
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ServerConfigContext>(options =>
            {
                options.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=ServerConfigContext;Trusted_Connection=True;MultipleActiveResultSets=true",
                    x => x.MigrationsAssembly("MythoticDiscordBot.DAL.Migrations"));
            });
            
            ServiceProvider serviceProvider = services.BuildServiceProvider();

            BotClient botClient = new BotClient(serviceProvider);
            services.AddSingleton(botClient);
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

        }
    }
}
