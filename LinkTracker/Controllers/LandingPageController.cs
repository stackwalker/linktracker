using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using p1p.Business;
using p1p.Types.DTO;
using log4net;

namespace p1p.Controllers
{
    public class LandingPageController : ApiController
    {

        LandingPageRepository repo = new LandingPageRepository();
        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        [Authorize(Roles="Manager,Admin")]
        [HttpPost]
        public void Add(LandingPageDTO l)
        {
            repo.Add(l);
        }

        [Authorize(Roles="Manager,Admin")]
        [HttpPost]
        public void Update(LandingPageDTO l)
        {
            repo.Update(l);
        }
    }
}
