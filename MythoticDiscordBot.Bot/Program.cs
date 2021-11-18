﻿using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Hosting;
using MythoticDiscordBot.Bot;

namespace MythoticDiscordBot.Bot
{
    class Program
    {
        public static DateTime ReadyTime { get; set; }
        
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