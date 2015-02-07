using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace p1p.Controllers.PageControllers
{
    public class SalesController : Controller
    {
        //
        // GET: /Sales/

        [Authorize(Roles="Manager,Admin,Employee")]
        public ActionResult Index()
        {
            return View();
        }

    }
}
