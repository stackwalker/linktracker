using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web;
using p1p.Business;
using p1p.Types;
using p1p.Types.DTO;
using log4net;
using System.Web.Security;

namespace p1p.Controllers
{
    public class TimeEntryController : ApiController
    {
        TimeRepository repo = new TimeRepository();

        [Authorize(Roles="Manager,Employee,Admin")]
        [HttpGet]
        public List<TimeEntryDTO> Search(int projectId, bool onlyMine, Nullable<DateTime> startDate, string endDate, int teamId, string activity)
        {
            Nullable<DateTime> modifiedEndDate = null;
            DateTime newEndDate;
            if (DateTime.TryParse(endDate, out newEndDate))
            {
                modifiedEndDate = newEndDate.AddDays(1);
            }
            string user = Membership.GetUser().UserName;
            return repo.Search(user, projectId, onlyMine, startDate, modifiedEndDate, teamId, activity);
        }

        [Authorize(Roles="Manager,Admin")]
        [HttpPost]
        public List<KronosTimeEntry> Add(List<KronosTimeEntry> entries)
        {
            List<KronosTimeEntry> failures = new List<KronosTimeEntry>();

            foreach (KronosTimeEntry entry in entries)
            {
                bool confirm = repo.AddRecentTimeEntry(entry);
                if (!confirm)
                {
                    failures.Add(entry);
                }
            }
            return failures;
        }

        [Authorize(Roles="Manager,Admin")]
        [HttpGet]
        public void Delete(int Id)
        {
            repo.Delete(Id);
        }
    }
}
