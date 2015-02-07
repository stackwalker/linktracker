using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using p1p.Business;
using p1p.Types.DTO;
using log4net;
using System.Web.Security;

namespace p1p.Controllers
{
    public class ReportController : ApiController
    {
        ReportRepository repo = new ReportRepository();

        [Authorize(Roles="Manager,Admin,Employee")]
        [HttpGet]
        public EmployeeDashboardReportDTO GetEmployeeDashboardReport(int projectId, bool onlyMine, Nullable<DateTime> startDate, string endDate, int teamId)
        {
            Nullable<DateTime> modifiedEndDate = null;
            DateTime newEndDate;
            if (DateTime.TryParse(endDate, out newEndDate))
            {
                modifiedEndDate = newEndDate.AddDays(1);
            }
            string user = Membership.GetUser().UserName;
            return repo.GetEmployeeDashboardReport(projectId, onlyMine, user, startDate, modifiedEndDate, teamId);
        }
    }
}
