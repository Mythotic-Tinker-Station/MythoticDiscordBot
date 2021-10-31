/* 
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ~ The Mythotic Discord Bot ~
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    MessageCreated.cs - Message Created Discord Event

    All functions that should be called once an message is created should be called here. Idealy this will call commands.


 */

using DSharpPlus;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MythoticDiscordBot.Events
{
    internal class MessageCreated
    {
        public static Task Discord_MessageCreated(DiscordClient sender, DSharpPlus.EventArgs.MessageCreateEventArgs e)
        {
            Console.WriteLine($"{e.Channel.Name}: {e.Message.Content}");
            if (e.Channel.Name.Equals("discordbot-dev"))
            {
                if (e.Message.Content.StartsWith(CommandLogic.CommandPrefix))
                {
                    string command = string.Concat(e.Message.Content.Split(' ')[0].Skip(1));

                    if (CommandLogic._Commands.ContainsKey(command))
                    {
                        sender.SendMessageAsync(e.Channel, CommandLogic._Commands[command]);
                    }
                }
            }

            return Task.CompletedTask;
        }
    }
}
