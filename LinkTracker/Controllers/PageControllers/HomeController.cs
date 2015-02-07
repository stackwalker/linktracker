using System;
using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using DotNetOpenAuth.AspNet;
using Microsoft.Web.WebPages.OAuth;
using WebMatrix.WebData;

namespace p1p.Controllers.PageControllers
{
    public class HomeController : Controller
    {
        [AllowAnonymous]
        public ActionResult Index()
        {
            if (System.Web.HttpContext.Current.User.Identity.IsAuthenticated)
            {
                string user = Membership.GetUser().UserName;
                if (Roles.IsUserInRole(user, "Client") && !(Roles.IsUserInRole(user, "Admin") || Roles.IsUserInRole(user, "Employee")))
                {
                    return RedirectToLocal("/Client");
                }
                if ((Roles.IsUserInRole(user, "Admin") || Roles.IsUserInRole(user, "Manager")) && !(Roles.IsUserInRole(user, "Client")))
                {
                    return RedirectToLocal("/Home/Employee");
                }
                else
                {
                    return RedirectToLocal("/Production/LinkBuilding");
                }
            }
            else
            {
                return RedirectToLocal("/Account/Login");
            }
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        public ActionResult LinkBuilding()
        {
            return View();
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        public ActionResult Employee()
        {            
            return View();
        }

        [Authorize(Roles="Manager,Admin,Employee")]
        public ActionResult Today()
        {
            return View();
        }

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }
    }
}
