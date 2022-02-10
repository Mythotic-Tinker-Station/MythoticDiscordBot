using DSharpPlus.CommandsNext.Attributes;
using DSharpPlus.CommandsNext;
using DSharpPlus.Entities;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MythoticDiscordBot.Bot.Interfaces;
using MythoticDiscordBot.DAL;
using DSharpPlus;
using MythoticDiscordBot.Core.Services;
using MythoticDiscordBot.DAL.Models.ServerConfig;
using MythoticDiscordBot.Core.Services.ServerConfigService;

namespace MythoticDiscordBot.Bot.Commands
{
    public class AdminCommands : BaseCommandModule, ICommandCategory
    {
        public string Category()
        {
            return "Administration";
        }

        private readonly IServerConfigService _service;

        public AdminCommands(IServerConfigService service)
        {
            _service = service;
        }

        //[RequirePermissions(Permissions.Administrator, true)]
        [Command("set")]
        [Description("Change an setting for your server")]
        public async Task Set(CommandContext ctx, string setting, string value)
        {
            try
            {
                ServerConfig serverConfig = await _service.GetServerConfigByServerId(ctx.Guild.Id);

                if (serverConfig == null)
                {
                    throw new Exception("Unable to find an Server Config in the database. The bot may need to rejoin the server!!!");
                }
                else
                {
                    await ctx.Message.RespondAsync($"Setting ``{_service.UpdateServerConfig(serverConfig, setting, value).Result}`` has been configured with the value ``{value}``");
                }
            }
            catch (Exception ex)
            {
                await ctx.Message.RespondAsync(ex.Message);
            }
        }

    }
}
