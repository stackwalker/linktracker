using System;
using System.Collections.Generic;
using System.Linq;
using p1p.Data;
using p1p.Types.DTO;
using p1p.Types;

namespace p1p.Business
{
    public class OutreachRepository
    {
        public List<OutreachDTO> GetAllOutreachForLink(int linkId)
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return (from o in ctx.Outreaches where o.LinkId == linkId select o)
                    .AsEnumerable()
                    .Select(o => (OutreachDTO)P1PObjectMapper.Convert(o, typeof(OutreachDTO))).ToList<OutreachDTO>();
            }
        }

        public List<OutreachDTO> Search (int linkId, int projectId, int typeId, int actionId, Nullable<DateTime> startDate, Nullable<DateTime> endDate, bool onlyMine, int teamId, string userName)
        {
            

            p1p.Data.OutreachDAO outreachDAO = new OutreachDAO();
            return outreachDAO.Search(linkId, projectId, typeId, actionId, startDate, endDate, onlyMine, teamId, userName);
        }

        public int[] AggregateSearchOutreachesByWeek(int linkId, int projectId, int typeId, int actionId, Nullable<DateTime> startDate, Nullable<DateTime> endDate, bool onlyMine, int teamId, string userName)
        {
            p1p.Data.OutreachAggregatesByWeekDAO o = new OutreachAggregatesByWeekDAO();
            return o.AggregateSearchOutreachesByWeek(linkId, projectId, typeId, actionId, startDate, endDate, onlyMine, teamId, userName);
        }

        public int[] GetOutreachAggregateByDate(List<OutreachDTO> outreaches, Nullable<DateTime> startDate, Nullable<DateTime> endDate)
        {
            DateTime newEndDate = endDate ?? DateTime.Now;
            DateTime newStartDate = startDate ?? DateTime.Now.AddYears(-1);

            double weeksDiv = (newEndDate - newStartDate).TotalDays / 7;
            int weeks = (int)Math.Ceiling(weeksDiv) + 1;
            int[] aggregateOutreach = new int[weeks];

            for (var i = 0; i < weeks; i++)
            {
                int endAdd = 7 * (0 - i);
                int startAdd = 7 * (0 - (i + 1));
                DateTime start = newEndDate.AddDays(startAdd);
                DateTime end = newEndDate.AddDays(endAdd);
                foreach (OutreachDTO outreach in outreaches)
                {
                    if (outreach.DateOutreached < end && outreach.DateOutreached > start)
                    {
                        aggregateOutreach[weeks - (i + 1)]++;
                    }
                }
            }

            return aggregateOutreach;
        }

        public void AddOutreach(OutreachDTO entry, string user)
        {
            
            p1p.Data.Link link;
            p1p.Data.Link linkMatch;
            entry.AddedBy = user;
            entry.InsertDate = DateTime.Now;
            p1p.Data.Outreach mdlOutreach = (p1p.Data.Outreach)P1PObjectMapper.Convert(entry, typeof(p1p.Data.Outreach));
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                if (entry.OutreachAction != null && ctx.OutreachActions.FirstOrDefault(oa => oa.Id == entry.OutreachAction.Id) != null)
                {
                    linkMatch = ctx.Links.Single(l => entry.LinkId == l.Id);
                    link = linkMatch;
                    link.LastModifiedBy = user;
                    link.DateLastModified = DateTime.Now;
                    ctx.Outreaches.Add(mdlOutreach);
                    ctx.Entry(linkMatch).CurrentValues.SetValues(link);
                    ctx.SaveChanges();
                }
                else
                {
                    throw new Exception("You must select an outreach action to save this outreach.");
                }
            }
        }

        public OutreachDTO UpdateOutreach(OutreachDTO entry)
        {
            p1p.Data.Outreach mdlOutreach = (p1p.Data.Outreach)P1PObjectMapper.Convert(entry, typeof(p1p.Data.Outreach));
            p1p.Data.Outreach match;
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                match = ctx.Outreaches.Single(e => entry.Id == e.Id);
                ctx.Entry(match).CurrentValues.SetValues(mdlOutreach);
                ctx.SaveChanges();
                return (OutreachDTO)P1PObjectMapper.Convert(match, typeof(OutreachDTO));
            }
        }

        public void DeleteOutreach(int entryId)
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                p1p.Data.Outreach entry = ctx.Outreaches.Single(w => entryId == w.Id);

                if (entry != null)
                {
                    ctx.Outreaches.Remove(entry);
                    ctx.SaveChanges();
                }
            }
        }
    }
}