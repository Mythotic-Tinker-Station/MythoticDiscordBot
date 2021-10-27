/* 
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ~ The Mythotic Discord Bot ~
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    Command Logic file - Contains the command logic


 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MythoticDiscordBot
{
    internal class CommandLogic
    {
        public const string CommandPrefix = "!";
        public static readonly Dictionary<string, string> _Commands = new();

        public static void SetCommand(string key, string value)
        {
            _Commands[key] = value;
        }
    }
}
