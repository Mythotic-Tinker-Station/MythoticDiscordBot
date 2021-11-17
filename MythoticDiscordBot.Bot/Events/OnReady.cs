/* 
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ~ The Mythotic Discord Bot ~
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    OnReady.cs - On Ready Discord Event

    All functions that should be called once the bot ready should be called here.


 */

using DSharpPlus;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MythoticDiscordBot.Events
{
    internal class OnReady
    {
        public static Task Discord_OnReady(DiscordClient sender, DSharpPlus.EventArgs.ReadyEventArgs e)
        {
            Console.WriteLine("The Bot is now ready!");
            Program.ReadyTime = DateTime.Now;
            
            return Task.CompletedTask;
        }
    }
}