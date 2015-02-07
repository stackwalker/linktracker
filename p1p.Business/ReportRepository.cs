using System;
using System.Collections.Generic;
using System.Linq;
using p1p.Types;
using p1p.Types.DTO;

namespace p1p.Business
{
    public class ReportRepository
    {
        public EmployeeDashboardReportDTO GetEmployeeDashboardReport(int projectId, bool onlyMine, string user, Nullable<DateTime> startDate, Nullable<DateTime> endDate, int teamId)
        {
            LinkRepository linkRepo = new LinkRepository();
            TimeRepository timeRepo = new TimeRepository();
            OutreachRepository outreachRepo = new OutreachRepository();
            ArticleRepository articleRepo = new ArticleRepository();

            EmployeeDashboardReportDTO rpt = new EmployeeDashboardReportDTO();

            rpt.NeedsAttentionProjectAggregates = linkRepo.AggregateSearch(projectId, 0, null, 0, onlyMine, user, null, DateTime.Now.AddDays(-5), false, teamId, false);
            rpt.NeedsAttentionWeeksAggregates = linkRepo.AggregateSearchByWeek(projectId, 0, 0, onlyMine, user, DateTime.Now.AddDays(-33), DateTime.Now.AddDays(-5), false, teamId);
            rpt.ScheduledLinkAggregates = linkRepo.AggregateSearch(projectId, 11, null, 0, onlyMine, user, null, null, true, teamId, false);
            rpt.OutreachLinkAggregates = linkRepo.AggregateSearch(projectId, 2, null, 0, onlyMine, user, null, null, false, teamId, false);
            rpt.InCommunicationLinkAggregates = linkRepo.AggregateSearch(projectId, 3, null, 0, onlyMine, user, null, null, false, teamId, false);
            rpt.LinksToActivateAggregates = linkRepo.AggregateSearch(projectId, 14, null, 0, onlyMine, user, null, null, false, teamId, false);
            rpt.SendToLeadershipLinkAggregates = linkRepo.AggregateSearch(projectId, 7, null, 0, onlyMine, user, null, null, false, teamId, false);
            rpt.AcquiredLinkAggregates = linkRepo.AggregateSearch(projectId, 10, null, 0, onlyMine, user, startDate, endDate, true, teamId, true);
            rpt.TimeEntryProjectAggregates = timeRepo.ProjectAggregateSearch(user, projectId, onlyMine, startDate, endDate, teamId, null);
            rpt.TimeEntryActivityAggregates = timeRepo.ActivityAggregateSearch(user, projectId, onlyMine, startDate, endDate, teamId, null);
            rpt.OutreachAggregatesByDate = outreachRepo.AggregateSearchOutreachesByWeek(0, projectId, 0, 0, startDate, endDate, onlyMine, teamId, user);
            rpt.InCommunicationLinkAggregatesByDate = linkRepo.AggregateSearchByWeek(projectId, 3, 0, onlyMine, user, startDate, endDate, false, teamId);
            Array.Reverse(rpt.InCommunicationLinkAggregatesByDate);
            rpt.NeedsOutreachLinkAggregates = linkRepo.AggregateSearch(projectId, 1, null, 0, onlyMine, user, null, null, false, teamId, false);
            if (onlyMine)
            {
                rpt.Articles = articleRepo.SearchArticles(projectId, user, true, teamId);
            }
            else
            {
                rpt.Articles = articleRepo.SearchArticles(projectId, null, true, teamId);
            }
            rpt.Weeks = new List<DateTime>();

            DateTime newEndDate = endDate ?? DateTime.Now;
            DateTime newStartDate = startDate ?? DateTime.Now.AddYears(-1);

            rpt.Weeks.Add(newStartDate.AddDays(1 - (int)newStartDate.DayOfWeek));
            int weeks = (int)Math.Floor((newEndDate - newStartDate.AddDays(2)).TotalDays / 7);
            DateTime tmp;
            if (weeks > 0)
            {
                tmp = newStartDate.AddDays(((int)DayOfWeek.Monday - (int)newStartDate.DayOfWeek + 7) % 7);
                rpt.Weeks.Add(tmp);
                weeks--;
                while (weeks > 0)
                {
                    tmp = tmp.AddDays(7);
                    rpt.Weeks.Add(tmp);
                    weeks--;
                }
            }
            rpt.Weeks.Add(newEndDate.AddDays(1 - (int)newEndDate.DayOfWeek));

            return rpt;
        }

        public ClientReportDTO GetClientReport(int projectId, Nullable<DateTime> startDate, Nullable<DateTime> endDate)
        {
            int totalDomainAuthority = 0;
            int totalArticles = 0;
            ClientReportDTO rpt = new ClientReportDTO();

            rpt.PeriodLinks = getPeriodActiveLinks(projectId, startDate, endDate);
            rpt.PeriodOutreach = getPeriodOutreach(projectId, startDate, endDate);
            rpt.PeriodHours = getPeriodHours(projectId, startDate, endDate);
            rpt.TotalHours = 0;

            double totalOutreachHours = 0;
            double totalArticleHours = 0;

            foreach (TimeEntryDTO entry in rpt.PeriodHours)
            {
                rpt.TotalHours += entry.Elapsed.TotalHours;

                switch (entry.Activity)
                {
                    case "Article Directory Writing":
                    case "Guest Post Article Writing":
                        totalArticleHours += entry.Elapsed.TotalHours;
                        break;
                    case "Article Directory Submitting":
                    case "Guest Post Outreach":
                    case "Research Outreach":
                        totalOutreachHours += entry.Elapsed.TotalHours;
                        break;
                }
            }

            rpt.TotalLinkCount = rpt.PeriodLinks.Where(lnk => "Link Acquired".Equals(lnk.LinkStatus.Name)).Count();

            if (rpt.TotalLinkCount > 0)
            {
                rpt.HoursPerLink = rpt.TotalHours / rpt.TotalLinkCount;
            }

            rpt.LinksInCommunicationCount = 0;
            rpt.LinksPendingCount = 0;
            rpt.TotalLinkCount = 0;
            rpt.UniqueDomainCount = 0;

            List<LinkDTO> duplicateCheck = new List<LinkDTO>();

            List<LinkDTO> allLinks = getPeriodLinks(projectId, startDate, endDate);

            //TODO quick fix I don't like, will make it better later
            List<p1p.Data.Link> foreverLinks = new List<p1p.Data.Link>();
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                foreverLinks = ctx.Links.Include("LinkStatus").Where(l => l.ProjectId == projectId).ToList<p1p.Data.Link>();
                List<p1p.Data.Article> unwritten = (from a in ctx.Articles
                                                    join x in ctx.ProjectArticleXREFs on a.Id equals x.ArticleId
                                                    where x.ProjectId == projectId && !a.ArticleStatus.Name.ToLower().Equals("unwritten")
                                                    select a).ToList<p1p.Data.Article>();
                totalArticles = unwritten.Count();
            }

            foreach (p1p.Data.Link link in foreverLinks)
            {
                if ("Outreach".Equals(link.LinkStatus.Name))
                {
                    rpt.SitesTargetedCount++;
                }
                if ("In Communication".Equals(link.LinkStatus.Name))
                {
                    rpt.LinksInCommunicationCount++;
                }
                if ("Scheduled".Equals(link.LinkStatus.Name))
                {
                    rpt.ScheduledCount++;
                }
            }

            foreach (LinkDTO link in rpt.PeriodLinks)
            {
                rpt.TotalLinkCount++;
                totalDomainAuthority += link.DomainAuthority;
                if (!duplicateCheck.Any(l => l.RootUrl.Equals(link.RootUrl)))
                {
                    rpt.UniqueDomainCount++;
                    duplicateCheck.Add(link);
                }
            }
            rpt.TotalOutreachCount = rpt.PeriodOutreach.Count;
            if (rpt.TotalLinkCount > 0)
            {
                rpt.AverageDomainAuthority = totalDomainAuthority / rpt.TotalLinkCount;
            }

            List<LinkDTO> activeLinks = new List<LinkDTO>();

            activeLinks = rpt.PeriodLinks.Where(l => "Link Acquired".Equals(l.LinkStatus.Name)).ToList<LinkDTO>();

            rpt.AggregateHoursByActivity = GetAggregateHours(rpt.PeriodHours);
            rpt.AggregateOutreach = GetAggregatedOutreach(rpt.PeriodOutreach);
            rpt.AggregateLinksByType = GetAggregateLinksByType(activeLinks);
            rpt.AggregateAnchorText = GetAggregateAnchorText(activeLinks);
            return rpt;
        }

        private List<Types.DataPoint> GetAggregateLinksByType(List<LinkDTO> links)
        {
            Dictionary<string, double> linkMap = new Dictionary<string, double>();

            foreach (LinkDTO l in links)
            {
                string type = l.LinkType.Name;
                if (linkMap.ContainsKey(type))
                {
                    linkMap[type]++;
                }
                else
                {
                    linkMap.Add(type, 1);
                }
            }

            return linkMap.Select(m => new Types.DataPoint()
            {
                Unit = m.Key,
                Value = m.Value / links.Count
            }).ToList<Types.DataPoint>();

        }

        private List<Types.DataPoint> GetAggregateAnchorText(List<LinkDTO> links)
        {
            Dictionary<string, double> linkMap = new Dictionary<string, double>();

            foreach (LinkDTO l in links)
            {
                if (linkMap.ContainsKey(l.AnchorText))
                {
                    linkMap[l.AnchorText]++;
                }
                else
                {
                    linkMap.Add(l.AnchorText, 1);
                }
            }

            return linkMap.Select(m => new Types.DataPoint()
            {
                Unit = m.Key,
                Value = m.Value / links.Count
            }).ToList<Types.DataPoint>();
        }

        private List<LinkDTO> getPeriodActiveLinks(int projectId, Nullable<DateTime> startDate, Nullable<DateTime> endDate)
        {
            using (p1p.Data.P1PContext ctx = new Data.P1PContext())
            {
                return (from lnk in ctx.Links
                        where lnk.ProjectId == projectId
                            && lnk.DatePublished >= startDate
                            && lnk.DatePublished <= endDate
                            && lnk.LinkStatus.Name.Equals("Link Acquired")
                        select lnk)
                        .AsEnumerable()
                        .Select(lnk => (LinkDTO)P1PObjectMapper.Convert(lnk, typeof(LinkDTO))).ToList<LinkDTO>();
            }
        }

        private List<LinkDTO> getPeriodLinks(int projectId, Nullable<DateTime> startDate, Nullable<DateTime> endDate)
        {
            using (p1p.Data.P1PContext ctx = new Data.P1PContext())
            {
                return (from lnk in ctx.Links
                        where lnk.ProjectId == projectId
                            && lnk.DateFound >= startDate
                            && lnk.DateFound <= endDate
                        select lnk)
                        .AsEnumerable()
                        .Select(lnk => (LinkDTO)P1PObjectMapper.Convert(lnk, typeof(LinkDTO))).ToList<LinkDTO>();
            }
        }

        private List<TimeEntryDTO> getPeriodHours(int projectId, Nullable<DateTime> startDate, Nullable<DateTime> endDate)
        {
            using (p1p.Data.P1PContext ctx = new Data.P1PContext())
            {
                return (from hr in ctx.TimeEntries
                        where hr.ProjectId == projectId
                        && hr.StartTime >= startDate
                        && hr.EndTime <= endDate
                        select hr)
                        .AsEnumerable()
                        .Select(hr => (TimeEntryDTO)P1PObjectMapper.Convert(hr, typeof(TimeEntryDTO))).ToList<TimeEntryDTO>();
            }
        }

        private List<OutreachDTO> getPeriodOutreach(int projectId, Nullable<DateTime> startDate, Nullable<DateTime> endDate)
        {
            using (p1p.Data.P1PContext ctx = new Data.P1PContext())
            {
                var links = ctx.Links.Where(l => l.ProjectId == projectId);

                return (from l in links
                        join outreach in ctx.Outreaches on l.Id equals outreach.LinkId
                        where outreach.DateOutreached >= startDate && outreach.DateOutreached <= endDate
                        select outreach)
                        .AsEnumerable()
                        .Select(outreach => (OutreachDTO)P1PObjectMapper.Convert(outreach, typeof(OutreachDTO))).ToList<OutreachDTO>();
            }
        }

        private List<Types.DataPoint> GetAggregateHours(List<TimeEntryDTO> hours)
        {
            Dictionary<string, TimeSpan> hourMap = new Dictionary<string, TimeSpan>();

            foreach (TimeEntryDTO te in hours)
            {
                if (hourMap.ContainsKey(te.Activity))
                {
                    hourMap[te.Activity] += te.Elapsed;
                }
                else
                {
                    hourMap.Add(te.Activity, te.Elapsed);
                }
            }

            return hourMap.Select(m => new Types.DataPoint()
            {
                Unit = m.Key,
                Value = Math.Round(m.Value.TotalHours, 2)
            }).ToList<Types.DataPoint>();
        }

        private List<Types.DataPoint> GetAggregatedOutreach(List<OutreachDTO> outreach)
        {
            Dictionary<string, int> outreachMap = new Dictionary<string, int>();

            foreach (OutreachDTO o in outreach)
            {
                if (o.OutreachAction != null)
                {
                    string action = o.OutreachAction.Name;
                    if (outreachMap.ContainsKey(action))
                    {
                        outreachMap[action]++;
                    }
                    else
                    {
                        outreachMap.Add(action, 1);
                    }
                }
            }

            return outreachMap.Select(m => new Types.DataPoint()
            {
                Unit = m.Key,
                Value = m.Value
            }).ToList<Types.DataPoint>();
        }

        public List<Types.ReportTimeSpan> getAvailableTimeSpans(int projectId)
        {
            List<Types.ReportTimeSpan> ts = new List<Types.ReportTimeSpan>();
            p1p.Data.Project p;

            using (p1p.Data.P1PContext ctx = new Data.P1PContext())
            {
                p = ctx.Projects.Include("BillingCycle").Single(prj => prj.Id == projectId);
            }

            DateTime cycleStart;

            if ("Standard".Equals(p.BillingCycle.Name))
            {
                cycleStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            }
            else
            {
                if (DateTime.Now < new DateTime(DateTime.Now.Year, DateTime.Now.Month, 15))
                {
                    cycleStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 15).AddMonths(-1);
                }
                else
                {
                    cycleStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 15);
                }
            }

            ts.Add(new Types.ReportTimeSpan() { Name = "Current Cycle", StartDate = cycleStart, EndDate = cycleStart.AddMonths(1).AddMinutes(-1) });
            ts.Add(new Types.ReportTimeSpan() { Name = "Previous Cycle", StartDate = cycleStart.AddMonths(-1), EndDate = cycleStart.AddMinutes(-1) });
            ts.Add(new Types.ReportTimeSpan() { Name = "3 Months", StartDate = cycleStart.AddMonths(-2), EndDate = cycleStart.AddMonths(1) });
            ts.Add(new Types.ReportTimeSpan() { Name = "6 Months", StartDate = cycleStart.AddMonths(-5), EndDate = cycleStart.AddMonths(1) });
            ts.Add(new Types.ReportTimeSpan() { Name = "1 Year", StartDate = cycleStart.AddMonths(-11), EndDate = cycleStart.AddMonths(1) });
            //ts.Add(new Types.ReportTimeSpan() { Name = "All Time", StartDate = p.DateCreated, EndDate = DateTime.Now });

            return ts;
        }

        public DateTime GetCycleStart(int projectId)
        {
            p1p.Data.Project p;

            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                p = ctx.Projects.Single(proj => proj.Id == projectId);
            }
            DateTime cycleStart;

            if (p.BillingCycleId == 1)
            {
                cycleStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            }
            else
            {
                if (DateTime.Now < new DateTime(DateTime.Now.Year, DateTime.Now.Month, 15))
                {
                    cycleStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 15).AddMonths(-1);
                }
                else
                {
                    cycleStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 15);
                }
            }

            return cycleStart;
        }
    }
}