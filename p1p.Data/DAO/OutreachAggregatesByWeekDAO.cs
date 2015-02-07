using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Objects;
using p1p.Types.DTO;

namespace p1p.Data
{
    public class OutreachAggregatesByWeekDAO
    {
        public int[] AggregateSearchOutreachesByWeek(int linkId, int projectId, int typeId, int actionId, Nullable<DateTime> startDate, Nullable<DateTime> endDate, bool onlyMine, int teamId, string userName)
        {
            int[] aggregates;
            ObjectResult<int?> results;
            using (P1PContext ctx = new P1PContext())
            {
                results = ctx.sp_Outreach_Aggregates_By_Week(linkId, projectId, typeId, actionId, startDate, endDate, onlyMine, teamId, userName);
                aggregates = results.Cast<int>().ToArray();
            }
            Array.Reverse(aggregates);
            return aggregates;
        }
    }
}
