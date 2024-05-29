using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers
{
    public class UserController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Register()
        {
            
            return View();
        }
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }
    }
}
