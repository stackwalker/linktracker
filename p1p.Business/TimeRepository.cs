using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Globalization;
using p1p.Data;
using p1p.Types;
using p1p.Types.DTO;
using log4net;
using System.Reflection;

namespace p1p.Business
{
    public class TimeRepository
    {
        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public List<TimeEntryDTO> Search(string userName, int projectId, bool onlyMine, Nullable<DateTime> startDate, Nullable<DateTime> endDate, int teamId, string activity)
        {         

            p1p.Data.TimeEntryDAO timeEntryDAO = new TimeEntryDAO();
            return timeEntryDAO.Search(userName, projectId, onlyMine, startDate, endDate, teamId, activity);
        }

        public List<AggregateDTO> ProjectAggregateSearch(string userName, int projectId, bool onlyMine, Nullable<DateTime> startDate, Nullable<DateTime> endDate, int teamId, string activity)
        {
            TimeAggregatesDAO dao = new TimeAggregatesDAO();
            return dao.ProjectAggregateSearch(userName, projectId, onlyMine, startDate, endDate, teamId, activity); 
        }

        public List<AggregateDTO> ActivityAggregateSearch(string userName, int projectId, bool onlyMine, Nullable<DateTime> startDate, Nullable<DateTime> endDate, int teamId, string activity)
        {
            TimeAggregatesDAO dao = new TimeAggregatesDAO();
            return dao.ActivityAggregateSearch(userName, projectId, onlyMine, startDate, endDate, teamId, activity);
        }

        public bool AddRecentTimeEntry(KronosTimeEntry kEntry)
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                try
                {
                    p1p.Data.TimeEntry thisEntry = ConvertToTimeEntry(kEntry);
                    if (thisEntry.StartTime < DateTime.Now.AddMonths(-1))
                    {
                        return true;
                    }
                    List<p1p.Data.TimeEntry> dupCheck = ctx.TimeEntries.Where(t => t.StartTime == thisEntry.StartTime && t.EndTime == thisEntry.EndTime && t.UserId.Equals(thisEntry.UserId)).ToList<p1p.Data.TimeEntry>();
                    if (dupCheck.Count > 0)
                    {
                        return true;
                    }
                    else
                    {
                        thisEntry.InsertDate = DateTime.Now;
                        ctx.TimeEntries.Add(thisEntry);
                        ctx.SaveChanges();
                        return true;
                    }
                }
                catch (Exception ex)
                {
                    log.Error("Failed to add Time Entry: " + ex.Message + ex.Message + kEntry.toJSON());
                    return false;
                }
            }

        }

        public List<AggregateDTO> GetAggregatesForTimeEntries(List<TimeEntryDTO> timeEntries, string property)
        {
            List<AggregateDTO> aggregates = new List<AggregateDTO>();
            List<KeyValueDTO> uniques = new List<KeyValueDTO>();
            int i = 0;
            PropertyInfo prop = null;

            foreach (TimeEntryDTO te in timeEntries)
            {
                object value = te;
                foreach (String part in property.Split('.'))
                {
                    Type type = value.GetType();
                    prop = type.GetProperty(part);
                    value = prop.GetValue(value, null);
                }
                if (value != null)
                {
                    KeyValueDTO unique = uniques.FirstOrDefault(u => u.Name.Equals(value));
                    if (unique != null)
                    {
                        aggregates[unique.Id].Aggregate+= te.Elapsed.TotalHours;
                    }
                    else
                    {
                        uniques.Add(new KeyValueDTO()
                        {
                            Id = i,
                            Name = (string)value
                        });
                        aggregates.Add(new AggregateDTO()
                        {
                            Name = (string)value,
                            Aggregate = te.Elapsed.TotalHours
                        });
                        i++;
                    }
                }
            }
            return aggregates;
        }

        private p1p.Data.TimeEntry ConvertToTimeEntry(KronosTimeEntry kEntry)
        {

            p1p.Data.TimeEntry te = new p1p.Data.TimeEntry();
            te.Activity = kEntry.Activity;

            if (!String.IsNullOrWhiteSpace(kEntry.Elapsed))
            {
                TimeSpan elapsed = TimeSpan.MinValue;
                TimeSpan.TryParse(kEntry.Elapsed, out elapsed);
                if (elapsed != TimeSpan.MinValue)
                {
                    te.Elapsed = elapsed;
                }
            }

            string dateStr = kEntry.Date.ToString("MM/dd/yyyy");
            if (!String.IsNullOrWhiteSpace(kEntry.StartTime))
            {
                kEntry.StartTime = kEntry.StartTime.ToUpper();
                DateTime startTime;
                string startStr = dateStr + " " + kEntry.StartTime;
                DateTime.TryParseExact(startStr, "MM/dd/yyyy hh:mmt", System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out startTime);
                te.StartTime = startTime;
            }

            if (!String.IsNullOrWhiteSpace(kEntry.EndTime))
            {
                kEntry.EndTime = kEntry.EndTime.ToUpper();
                DateTime endTime;
                string endStr = dateStr + " " + kEntry.EndTime;
                DateTime.TryParseExact(endStr, "MM/dd/yyyy hh:mmt", System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out endTime);
                te.EndTime = endTime;
            }

            if (!String.IsNullOrWhiteSpace(kEntry.IsTimeOff))
            {
                te.IsTimeOff = "y".Equals(kEntry.IsTimeOff.ToLower());
            }

            te.Note = kEntry.Note;
            te.UserId = IdentityHelper.GetUserIdByName(kEntry.FirstName, kEntry.LastName);
            te.InsertDate = DateTime.Now;
            ProjectsRepository pRepo = new ProjectsRepository();

            string[] team_project = kEntry.Project.Split('/');
            if (team_project.Length > 0)
            {
                string team = team_project[0];
            }
            string project = "Undefined";
            if (team_project.Length > 1)
            {
                if (team_project.Length == 2)
                {
                    project = team_project[1];
                }
                else
                {
                    project = team_project[2];
                }
            }
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                List<p1p.Data.Project> proj = ctx.Projects.Where(p => p.Name.Equals(project, StringComparison.OrdinalIgnoreCase)).ToList<p1p.Data.Project>();
                if (proj.Count > 0)
                {
                    te.ProjectId = proj[0].Id;
                }
                else
                {
                    throw new Exception("Project named: " + project + " not found.  Skipping this entry.");
                }

                return te;
            }
        }

        public void Delete(int Id)
        {
            p1p.Data.TimeEntry te;
            using(p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                te = ctx.TimeEntries.Single(t => t.Id == Id);
                ctx.TimeEntries.Remove(te);
                ctx.SaveChanges();
            }
        }
    }
}