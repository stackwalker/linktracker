using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace p1p.Controllers.PageControllers
{
    public class ProductionController : Controller
    {
        //
        // GET: /Production/
        [Authorize(Roles = "Manager,Admin,Employee")]
        public ActionResult KeywordResearch()
        {
            return View();
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        public ActionResult Article()
        {
            return View();
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        public ActionResult LinkBuilding()
        {
            return View();
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        public ActionResult ProjectInformation()
        {
            return View();
        }
    }
}
