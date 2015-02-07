using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Objects;
using p1p.Types.DTO;

namespace p1p.Data
{
    public class LinkAggregatesByWeekDAO
    {
        public int[] AggregateSearchLinksByWeek(int projectId, int status, int linkStrategy, bool onlyMine, string userName, Nullable<DateTime> startDate, Nullable<DateTime> endDate, bool includeNotInUse, int teamId)
        {
            int[] aggregates;
            ObjectResult<int?> results;
            using (P1PContext ctx = new P1PContext())
            {
                results = ctx.sp_Links_Aggregates_By_Week(projectId, status, linkStrategy, onlyMine, userName, startDate, endDate, includeNotInUse, teamId);
                aggregates = results.Cast<int>().ToArray();               
            }            
            return aggregates;
        }
    }
}
