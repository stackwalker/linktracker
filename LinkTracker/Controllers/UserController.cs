using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Security;
using WebMatrix.WebData;
using p1p.Business;
using p1p.Types.DTO;
using log4net;

namespace p1p.Controllers
{
    
    public class UserController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        [Authorize(Roles="Manager,Employee,Client,Admin")]
        [HttpGet]
        public string GetCurrentUser()
        {
            return Membership.GetUser().UserName;

        }

        [Authorize(Roles="Manager,Employee,Client,Admin")]
        [HttpGet]
        public bool IsUserInGroup(string roleName)
        {
            return Roles.IsUserInRole(roleName);
        }

        [Authorize(Roles="Manager,Employee,Client,Admin")]
        [HttpGet]
        public void ChangePassword(string oldPassword, string newPassword)
        {
            MembershipUser u = Membership.GetUser();
            u.ChangePassword(oldPassword, newPassword);
        }
    }
}
