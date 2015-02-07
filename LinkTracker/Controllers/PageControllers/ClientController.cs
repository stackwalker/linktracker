using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace p1p.Controllers
{
    public class ClientController : Controller
    {
        [Authorize(Roles = "Manager,Client,Employee,Admin")]
        public ActionResult Index()
        {
            return View();
        }
    }
}
