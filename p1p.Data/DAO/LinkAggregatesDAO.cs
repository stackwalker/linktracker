using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Objects;
using p1p.Types.DTO;

namespace p1p.Data
{
    public class LinkAggregatesDAO
    {
        public List<AggregateDTO> AggregateSearch(int projectId, int status, int linkStrategy, bool onlyMine, string userName, Nullable<DateTime> startDate, Nullable<DateTime> endDate, bool includeNotInUse, int teamId, bool isActive)
        {
            List<AggregateDTO> aggregates = new List<AggregateDTO>();
            ObjectResult<p1p.Data.sp_Links_Aggregates_Result2> aggregateResults;
            using (P1PContext ctx = new P1PContext())
            {
                aggregateResults = ctx.sp_Links_Aggregates(projectId, status, linkStrategy, onlyMine, userName, startDate, endDate, includeNotInUse, teamId, isActive);
                foreach (sp_Links_Aggregates_Result2 a in aggregateResults)
                {
                    if (a.ProjectAggregate != null && a.ProjectAggregate > 0)
                    {
                        aggregates.Add(new AggregateDTO()
                        {
                            Name = a.Name,
                            Aggregate = (double)a.ProjectAggregate
                        });
                    }
                }
            }

            

            return aggregates;
        }

    }
}
