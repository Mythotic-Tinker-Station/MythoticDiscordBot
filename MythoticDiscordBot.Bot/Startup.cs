using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using static MythoticDiscordBot.Bot.JsonClasses;
using MythoticDiscordBot.DAL;
using System.Text.Json;
using MythoticDiscordBot.Core.Services.ServerConfigService;

namespace MythoticDiscordBot.Bot
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            // First, lets read the config!
            ConfigJson config = JsonSerializer.Deserialize<ConfigJson>(File.ReadAllText("Config\\config.json"));

            // Enable MVC
            services.AddMvc();

            // Enable Blazor
            services.AddServerSideBlazor();
            services.AddControllersWithViews();

            // Add DB stuff
            services.AddDbContext<ServerConfigContext>(options =>
            {
                options.UseSqlServer(config.DatabaseConnectionString,
                    x => x.MigrationsAssembly("MythoticDiscordBot.DAL.Migrations"));
                options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            });

            services.AddScoped<IServerConfigService, ServerConfigService>();

            ServiceProvider serviceProvider = services.BuildServiceProvider();

            // Run bot
            BotClient botClient = new(serviceProvider, config);
            services.AddSingleton(botClient);
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }

            app.UseStaticFiles();

            app.UseRouting();
            app.UseEndpoints(e =>
            {
                e.MapControllerRoute("default", "{area=WebUI}/{controller=Home}/{action=Index}/{id?}");
                e.MapBlazorHub();
            });

        }
    }
}
