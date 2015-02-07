using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace p1p.Controllers
{
    public class AdminController : Controller
    {
        //
        // GET: /Admin/
        [Authorize(Roles = "Manager,Admin")]
        public ActionResult Customer()
        {
            return View();
        }

        [Authorize(Roles = "Manager,Admin")]
        public ActionResult Employee()
        {
            return View();
        }

         [Authorize(Roles = "Manager,Admin")]
        public ActionResult Hours()
        {
            return View();
        }

        [Authorize(Roles = "Admin")]
        public ActionResult Winners()
        {
            return View();
        }
    }
}
