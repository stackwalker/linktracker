using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using p1p.Business;
using p1p.Types.DTO;
using WebMatrix.WebData;
using System.Web.Security;
using log4net;

namespace p1p.Controllers
{
    [Authorize(Roles = "Manager,Admin")]
    public class RoleController : ApiController
    {
        [HttpGet]
        public List<Types.DTO.RoleDTO> GetAll()
        {
            return new SecurityHelper().GetAllRoles();
        }
    }
}
