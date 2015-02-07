using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using p1p.Data;
using p1p.Types.DTO;
using log4net;
using p1p.Types;
using System.Reflection;

namespace p1p.Business
{
    public class LinkRepository
    {
        public List<LinkDTO> Search(int projectId, int status, int linkStrategy, bool onlyMine, string userName, int categoryId, Nullable<DateTime> startDate, Nullable<DateTime> endDate, bool includeNotInUse, int teamId, bool isActive)
        {           
            p1p.Data.LinkDAO linkDAO = new p1p.Data.LinkDAO();
            return linkDAO.Search(projectId, status, linkStrategy, onlyMine, userName, categoryId, startDate, endDate, includeNotInUse, teamId, isActive);
        }

        public List<AggregateDTO> AggregateSearch(int projectId, int status, string categories, int linkStrategy, bool onlyMine, string userName, Nullable<DateTime> startDate, Nullable<DateTime> endDate, bool includeNotInUse, int teamId, bool isActive)
        {
            p1p.Data.LinkAggregatesDAO l = new p1p.Data.LinkAggregatesDAO();
            return l.AggregateSearch(projectId, status, linkStrategy, onlyMine, userName, startDate, endDate, includeNotInUse, teamId, isActive);
        }

        public int[] AggregateSearchByWeek(int projectId, int status, int linkStrategy, bool onlyMine, string userName, Nullable<DateTime> startDate, Nullable<DateTime> endDate, bool includeNotInUse, int teamId)
        {
            p1p.Data.LinkAggregatesByWeekDAO l = new p1p.Data.LinkAggregatesByWeekDAO();
            return l.AggregateSearchLinksByWeek(projectId, status, linkStrategy, onlyMine, userName, startDate, endDate, includeNotInUse, teamId);
        }

        public List<KeyValueDTO> GetWeeklyAggregate(List<LinkDTO> links)
        {
            List<KeyValueDTO> aggregate = new List<KeyValueDTO>();
            aggregate.Add(new KeyValueDTO()
            {
                Id = 0,
                Name = DateTime.Today.AddDays(-32).ToString().Split(' ')[0] + " - " + DateTime.Today.AddDays(-25).ToString().Split(' ')[0]
            });
            aggregate.Add(new KeyValueDTO()
            {
                Id = 0,
                Name = DateTime.Today.AddDays(-24).ToString().Split(' ')[0] + " - " + DateTime.Today.AddDays(-18).ToString().Split(' ')[0]
            });
            aggregate.Add(new KeyValueDTO()
            {
                Id = 0,
                Name = DateTime.Today.AddDays(-17).ToString().Split(' ')[0] + " - " + DateTime.Today.AddDays(-11).ToString().Split(' ')[0]
            });
            aggregate.Add(new KeyValueDTO()
            {
                Id = 0,
                Name = DateTime.Today.AddDays(-10).ToString().Split(' ')[0] + " - " + DateTime.Today.AddDays(-4).ToString().Split(' ')[0]
            });

            foreach (LinkDTO link in links)
            {
                if (link.DateLastModified > DateTime.Now.AddDays(-32) && link.DateLastModified <= DateTime.Now.AddDays(-25))
                {
                    aggregate[3].Id++;
                } 
                else{
                    if (link.DateLastModified > DateTime.Now.AddDays(-25) && link.DateLastModified <= DateTime.Now.AddDays(-18)) {
                        aggregate[2].Id++;
                    } else {
                        if (link.DateLastModified > DateTime.Now.AddDays(-18) && link.DateLastModified <= DateTime.Now.AddDays(-11)) {
                            aggregate[1].Id++;
                        }
                        else
                        {
                            if (link.DateLastModified > DateTime.Now.AddDays(-11) && link.DateLastModified <= DateTime.Now.AddDays(-4)){
                                aggregate[0].Id++;
                            }
                        }
                    }
                }
            }

            return aggregate;

        }

        public bool IsDuplicateUrl(string url, int projectId)
        {
            bool isDuplicate = false;
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                List<p1p.Data.Link> links = ctx.Links.Where(l => l.ProjectId == projectId && l.RootUrl.Equals(url)).ToList<p1p.Data.Link>();
                if (links.Count > 0)
                {
                    isDuplicate = true;
                }
            }
            return isDuplicate;
        }

        public LinkDTO Get(int linkId)
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return (LinkDTO)P1PObjectMapper.Convert(ctx.Links.Single(l => l.Id == linkId), typeof(LinkDTO));
            }
        }

        public LinksWithAggregatesDTO GetLinksWithAggregates(int projectId, int status, int linkStrategy, bool onlyMine, string userName, int categoryId, Nullable<DateTime> startDate, Nullable<DateTime> endDate, bool includeNotInUse, int teamId, string aggregateBy, bool isActive)
        {
            LinksWithAggregatesDTO lwa = new LinksWithAggregatesDTO();
            lwa.Links = Search(projectId, status, linkStrategy, onlyMine, userName, categoryId, startDate, endDate, includeNotInUse, teamId, isActive);
            lwa.Aggregates = GetAggregatesForLinks(lwa.Links, aggregateBy);
            return lwa;
        }

        public List<AggregateDTO> GetAggregatesForLinks(List<LinkDTO> links, string property)
        {
            List<AggregateDTO> aggregates = new List<AggregateDTO>();
            List<KeyValueDTO> uniques = new List<KeyValueDTO>();
            int i = 0;
            PropertyInfo prop = null;
            
            foreach (LinkDTO l in links)
            {
                object value = l;
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
                        aggregates[unique.Id].Aggregate++;
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
                            Aggregate = 1
                        });
                        i++;
                    }
                }
            }
            return aggregates;
        }

        //TODO I hate all these things super specific need methods so much
        public int[] GetAggregateLinksByDate(List<LinkDTO> links, Nullable<DateTime> startDate, Nullable<DateTime> endDate)
        {
            DateTime newEndDate = endDate ?? DateTime.Now;
            DateTime newStartDate = startDate ?? DateTime.Now.AddYears(-1);

            double weeksDiv = (newEndDate - newStartDate).TotalDays / 7;
            int weeks = (int)Math.Ceiling(weeksDiv) + 1;
            int[] aggregateLinks;
            if (weeks > 0)
            {
                aggregateLinks = new int[weeks];

                for (int i = 0; i < weeks; i++)
                {
                    int endAdd = 7 * (0 - i);
                    int startAdd = 7 * (0 - (i + 1));
                    DateTime start = newEndDate.AddDays(startAdd);
                    DateTime end = newEndDate.AddDays(endAdd);
                    foreach (LinkDTO link in links)
                    {
                        if (link.DateLastModified < end && link.DateLastModified > start)
                        {
                            aggregateLinks[weeks - (i + 1)]++;
                        }
                    }
                }
            }
            else
            {
                aggregateLinks = new int[1];
                aggregateLinks[0] = links.Count;
            }

            return aggregateLinks;
        }

        public LinkDTO AddLink(LinkDTO link, string userName)
        {
            p1p.Data.Link mdlLink = (p1p.Data.Link)P1PObjectMapper.Convert(link, typeof(p1p.Data.Link));
            mdlLink.LastModifiedBy = userName;
            mdlLink.DateLastModified = DateTime.Now;
            mdlLink.InsertDate = DateTime.Now;
            p1p.Data.Link newLink = new p1p.Data.Link();
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                if (mdlLink.LinkStatusId == 10 || mdlLink.LinkStatusId == 14)
                {
                    throw new Exception("You must use the 'Request Active' button.");
                }
                //TODO Need to verify that Article isn't being incorrectly instantiated when the link has no article
                if (link.Article != null && link.Article.Id > 0)
                {
                    ProjectArticleXREF xref = ctx.ProjectArticleXREFs.Single(x => x.ProjectId == link.ProjectId && x.ArticleId == link.Article.Id);
                    mdlLink.ProjectArticleXREFId = xref.Id;
                }
                newLink = ctx.Links.Add(mdlLink);
                ctx.SaveChanges();
            }
            return Get(newLink.Id);
        }

        public LinkDTO UpdateLink(LinkDTO link, string userName)
        {
            p1p.Data.Link mdlLink = (p1p.Data.Link)P1PObjectMapper.Convert(link, typeof(p1p.Data.Link));
            p1p.Data.Link match;
            mdlLink.LastModifiedBy = userName;
            mdlLink.DateLastModified = DateTime.Now;
            
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                match = ctx.Links.Single(l => link.Id == l.Id);
                if (match.LinkStatusId != 10 && link.LinkStatus.Id == 10)
                {
                    throw new Exception("You cannot set a link active through the 'UpdateLink' method.");
                }

                if(match.LinkStatusId != 14 && link.LinkStatus.Id == 14){
                    throw new Exception("You cannot set a link to 'Request Active' through the 'UpdateLink' method.");
                }

                if (link.Article != null && link.Article.Id > 0)
                {
                    p1p.Data.ProjectArticleXREF pax = ctx.ProjectArticleXREFs.Single(x => x.ArticleId == link.Article.Id && x.ProjectId == link.ProjectId);
                    mdlLink.ProjectArticleXREFId = pax.Id;
                }

                ctx.Entry(match).CurrentValues.SetValues(mdlLink);
                ctx.SaveChanges();
                return (LinkDTO)P1PObjectMapper.Convert(match, typeof(LinkDTO));
            }
        }

        public LinkDTO RequestActive(LinkDTO link, string userName)
        {
            p1p.Data.Link mdlLink = (p1p.Data.Link)P1PObjectMapper.Convert(link, typeof(p1p.Data.Link));
            p1p.Data.Link match;
            mdlLink.LastModifiedBy = userName;
            mdlLink.DateLastModified = DateTime.Now;

            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                match = ctx.Links.Single(l => link.Id == l.Id);

                if (link.Article != null && link.Article.Id > 0)
                {
                    p1p.Data.ProjectArticleXREF pax = ctx.ProjectArticleXREFs.Single(x => x.ArticleId == link.Article.Id && x.ProjectId == link.ProjectId);
                    mdlLink.ProjectArticleXREFId = pax.Id;
                }

                mdlLink.LinkStatusId = 14;
                mdlLink.AcquiredBy = userName;
                mdlLink.DatePublished = DateTime.Now;

                ctx.Entry(match).CurrentValues.SetValues(mdlLink);
                ctx.SaveChanges();
                return (LinkDTO)P1PObjectMapper.Convert(match, typeof(LinkDTO));
            }
        }

        public void ActivateLink(LinkDTO link)
        {
            p1p.Data.Link mdlLink = (p1p.Data.Link)P1PObjectMapper.Convert(link, typeof(p1p.Data.Link));
            p1p.Data.Link match;
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                if (link.Article.Id != 0) {
                    p1p.Data.Article article = ctx.Articles.Single(a => a.Id == link.Article.Id);
                    p1p.Data.Article updatedArticle = article;
                    updatedArticle.ArticleStatusId = 4;
                    ctx.Entry(article).CurrentValues.SetValues(updatedArticle);
                }
                match = ctx.Links.Single(l => link.Id == l.Id);
                ctx.Entry(match).CurrentValues.SetValues(mdlLink);
                ctx.SaveChanges();
            }
        }

        public void DeleteLink(int linkId)
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                List<p1p.Data.Link> toDel = ctx.Links.Where(wl => wl.Id == linkId).ToList<p1p.Data.Link>();
                for (int i = 0; i < toDel.Count; i++)
                {
                    try
                    {
                        ctx.Links.Remove(toDel[i]);
                        ctx.SaveChanges();
                    }
                    catch(System.Data.Entity.Infrastructure.DbUpdateException ex)
                    {
                        if ("The DELETE statement conflicted with the REFERENCE constraint \"FK_dbo.Outreaches_dbo.Links_LinkId\". The conflict occurred in database \"p1pLinkTracker\", table \"dbo.Outreaches\", column 'LinkId'.\r\nThe statement has been terminated.".Equals(ex.InnerException.InnerException.Message))
                        {
                            throw new Exception("You can't delete this link because it has outreaches assigned to it.");
                        }
                        else
                        {
                            throw new Exception("Could not delete Link.");
                        }
                    }
                }
            }
        }
       
    }
}