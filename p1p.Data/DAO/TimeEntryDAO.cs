using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Objects;
using p1p.Types.DTO;

namespace p1p.Data
{
    public class TimeEntryDAO
    {
        public List<TimeEntryDTO> Search(string userName, int projectId, bool onlyMine, Nullable<DateTime> startDate, Nullable<DateTime> endDate, int teamId, string activity)
        {
            ObjectResult<p1p.Data.TimeEntry> resultTimeEntries;
            List<TimeEntryDTO> dtoTimeEntries = new List<TimeEntryDTO>();

            using (P1PContext ctx = new P1PContext())
            {
                resultTimeEntries = ctx.SearchTimeEntries(userName, projectId, onlyMine, startDate, endDate, teamId, activity);
                foreach (TimeEntry te in resultTimeEntries)
                {
                    TimeEntryDTO timeEntry = new TimeEntryDTO()
                    {
                        Id = te.Id,
                        ProjectId = te.ProjectId,
                        UserId = te.UserId,
                        StartTime = te.StartTime,
                        EndTime = te.EndTime,
                        Elapsed = te.Elapsed,
                        Activity = te.Activity,
                        Note = te.Note,
                        IsTimeOff = te.IsTimeOff,
                        InsertDate = te.InsertDate
                    };

                    //TODO This is temporarily being done - needs refactoring since the whole project object is not being constructed
                    if (te.Project != null)
                    {
                        timeEntry.Project = new ProjectDTO()
                        {                            
                            Id = te.Project.Id,
                            Name = te.Project.Name
                        };
                    }
                    dtoTimeEntries.Add(timeEntry);
                }
            }
            return dtoTimeEntries;
        }
    }
}
