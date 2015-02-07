using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Objects;
using p1p.Types.DTO;


namespace p1p.Data
{
    public class TimeAggregatesDAO
    {
        public List<AggregateDTO> ProjectAggregateSearch(string userName, int projectId, bool onlyMine, Nullable<DateTime> startDate, Nullable<DateTime> endDate, int teamId, string activity)
        {
            List<AggregateDTO> aggregates = new List<AggregateDTO>();
            ObjectResult<p1p.Data.sp_Hours_Aggregates_By_Project_Result1> results;
            using (P1PContext ctx = new P1PContext())
            {
                results = ctx.sp_Hours_Aggregates_By_Project(userName, projectId, onlyMine, startDate, endDate, teamId, activity);
                foreach (sp_Hours_Aggregates_By_Project_Result1 a in results)
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

        public List<AggregateDTO> ActivityAggregateSearch(string userName, int projectId, bool onlyMine, Nullable<DateTime> startDate, Nullable<DateTime> endDate, int teamId, string activity)
        {
            List<AggregateDTO> aggregates = new List<AggregateDTO>();
            ObjectResult<p1p.Data.sp_Hours_Aggregates_By_Activity_Result1> results;
            using (P1PContext ctx = new P1PContext())
            {
                results = ctx.sp_Hours_Aggregates_By_Activity(userName, projectId, onlyMine, startDate, endDate, teamId, activity);
                foreach (sp_Hours_Aggregates_By_Activity_Result1 a in results)
                {
                    if (a.ProjectAggregate != null && a.ProjectAggregate > 0)
                    {
                        aggregates.Add(new AggregateDTO()
                        {
                            Name = a.Name,
                            Aggregate = (double)(a.ProjectAggregate ?? 0)
                        });
                    }
                }
            }

            return aggregates;
        }
    }
}
