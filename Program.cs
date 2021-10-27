using MythoticDiscordBot.Bot;

namespace MythoticDiscordBot
{
    class Program
    {
        static void Main(string[] args)
        {
            BotClient bot = new BotClient();
            bot.RunAsync().GetAwaiter().GetResult();
        }
    }
}