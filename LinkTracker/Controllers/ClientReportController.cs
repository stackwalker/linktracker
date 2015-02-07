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
    [Authorize(Roles = "Manager,Client,Employee,Admin")]
    public class ClientReportController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        ReportRepository repo = new ReportRepository();

        [HttpGet]
        public ClientReportDTO GetPeriodData(int projectId, Nullable<DateTime> startDate, string endDate)
        {
            Nullable<DateTime> modifiedEndDate = null;
            DateTime newEndDate;
            if (DateTime.TryParse(endDate, out newEndDate))
            {
                modifiedEndDate = newEndDate.AddDays(1);
            }
            return repo.GetClientReport(projectId, startDate, modifiedEndDate);

        }

        [HttpGet]
        public DateTime GetCycleStart(int projectId)
        {
            return repo.GetCycleStart(projectId);
        }

        //[HttpGet]
        //public List<Types.ReportTimeSpan> GetAvailableTimeSpans(int projectId)
        //{

        //    return repo.getAvailableTimeSpans(projectId);

        //}
    }
}
