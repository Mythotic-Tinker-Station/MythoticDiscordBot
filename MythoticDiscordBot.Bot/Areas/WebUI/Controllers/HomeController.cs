using Microsoft.AspNetCore.Mvc;

using MythoticDiscordBot.DAL;

namespace MythoticDiscordBot.Bot.Web.Controllers
{
    [Area("WebUI")]
    public class HomeController : Controller
    {
        private readonly ServerConfigContext _context;

        public HomeController()
        {
        }

        /*public HomeController(ServerConfigContext context)
        {
            _context = context;
        }*/

        public IActionResult Index()
        {
            return View();
        }
    }
}
