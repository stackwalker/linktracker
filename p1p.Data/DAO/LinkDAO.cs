using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Objects;
using p1p.Types.DTO;

namespace p1p.Data
{
    public class LinkDAO
    {
        public List<LinkDTO> Search(int projectId, int status, int linkStrategy, bool onlyMine, string userName, int categoryId, Nullable<DateTime> startDate, Nullable<DateTime> endDate, bool includeNotInUse, int teamId, bool isActive)
        {
            ObjectResult<p1p.Data.Link> resultLinks;
            List<LinkDTO> dtoLinks = new List<LinkDTO>();

            using (P1PContext ctx = new p1p.Data.P1PContext()) {
                resultLinks = ctx.SearchLinks(projectId, status, linkStrategy, onlyMine, userName, categoryId, startDate, endDate, includeNotInUse, teamId, isActive);
                foreach (Link l in resultLinks)
                {
                    LinkDTO link = new LinkDTO()
                    {
                        Id = l.Id,
                        ProjectId = l.ProjectId,
                        Project = (new ProjectDTO()
                        {
                            Id = l.Project.Id,
                            Name = l.Project.Name,
                            Description = l.Project.Description,
                            CustomerId = l.Project.CustomerId,
                            IsActive = l.Project.IsActive,
                            DateCreated = l.Project.DateCreated,
                        }),
                        TargetUrl = l.TargetUrl,
                        RootUrl = l.RootUrl,
                        RootMethod = l.RootMethod,
                        LinkStrategy = (new KeyValueDTO()
                        {
                            Id = l.LinkStrategy.Id,
                            Name = l.LinkStrategy.Name
                        }),
                        AnchorText = l.AnchorText,
                        DomainAuthority = l.DomainAuthority,
                        PageRelevance = l.PageRelevance,
                        SiteRelevance = l.SiteRelevance,
                        LinkLocation = (new KeyValueDTO()
                        {
                            Id = l.LinkLocation.Id,
                            Name = l.LinkLocation.Name
                        }),
                        PublishedUrl = l.PublishedUrl,
                        LandingPage = l.LandingPage,
                        LinkStatus = (new KeyValueDTO()
                        {
                            Id = l.LinkStatus.Id,
                            Name = l.LinkStatus.Name
                        }),
                        DateFound = l.DateFound,
                        DatePublished = l.DatePublished,
                        FoundBy = l.FoundBy,
                        LastModifiedBy = l.LastModifiedBy,
                        DateLastModified = l.DateLastModified,
                        AcquiredBy = l.AcquiredBy,
                        LinkBuildingMode = (new KeyValueDTO()
                        {
                            Id = l.LinkBuildingMode.Id,
                            Name = l.LinkBuildingMode.Name
                        }),
                        ContactEmail = l.ContactEmail,
                        ContactPhone = l.ContactPhone,
                        ContactUrl = l.ContactUrl,
                        Notes = l.Notes,
                        LinkType = (new KeyValueDTO()
                        {
                            Id = l.LinkType.Id,
                            Name = l.LinkType.Name
                        }),
                        InsertDate = l.InsertDate,
                        Article = new ArticleDTO(),
                        ProjectArticleXREFId = l.ProjectArticleXREFId,
                        IsWinner = l.IsWinner
                    };

                    if (link.ProjectArticleXREFId != null && link.ProjectArticleXREFId != 0)
                    {
                        link.Article.Id = l.ProjectArticleXREF.Article.Id;
                        link.Article.Title = l.ProjectArticleXREF.Article.Title;
                        link.Article.CreatedBy = l.ProjectArticleXREF.Article.CreatedBy;
                        link.Article.ArticleStatusId = l.ProjectArticleXREF.Article.ArticleStatusId;
                        link.Article.CreatedDate = l.ProjectArticleXREF.Article.CreatedDate;
                    }

                    dtoLinks.Add(link);

                    }

                }
            return dtoLinks;
        }
    }
}
