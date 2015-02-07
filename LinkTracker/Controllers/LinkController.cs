using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using p1p.Business;
using p1p.Types.DTO;
using log4net;
using System.Web.Security;

namespace p1p.Controllers
{
    
    public class LinkController : ApiController
    {
        LinkRepository repo = new LinkRepository();

        [Authorize(Roles="Manager,Employee, Admin")]
        [HttpGet]
        public LinkDTO Get(int linkId)
        {
            return repo.Get(linkId);
        }

        [Authorize(Roles="Manager,Employee, Admin")]
        [HttpGet]
        public bool IsDuplicateUrl(string url, int projectId)
        {
            return repo.IsDuplicateUrl(url, projectId);
        }

        [Authorize(Roles="Manager,Employee, Admin")]
        [HttpGet]
        public List<LinkDTO> Search(int projectId, int status, int linkStrategy, bool onlyMine, int categoryId, Nullable<DateTime> startDate, string endDate, bool includeNotInUse, int teamId, bool isActive)
        {
            Nullable<DateTime> modifiedEndDate = null;
            DateTime newEndDate;
            if (DateTime.TryParse(endDate, out newEndDate))
            {
                modifiedEndDate = newEndDate.AddDays(1);
            }
            string user = Membership.GetUser().UserName;
            return repo.Search(projectId, status, linkStrategy, onlyMine, user, categoryId, startDate, modifiedEndDate, includeNotInUse, teamId, isActive);
        }

        [Authorize(Roles = "Manager,Employee, Admin")]
        [HttpGet]
        public LinksWithAggregatesDTO GetLinksWithAggregates(int projectId, int status, int linkStrategy, bool onlyMine, int categoryId, Nullable<DateTime> startDate, string endDate, bool includeNotInUse, int teamId, string aggregateBy, bool isActive)
        {
            Nullable<DateTime> modifiedEndDate = null;
            DateTime newEndDate;
            if (DateTime.TryParse(endDate, out newEndDate))
            {
                modifiedEndDate = newEndDate.AddDays(1);
            }
            string user = Membership.GetUser().UserName;
            return repo.GetLinksWithAggregates(projectId, status, linkStrategy, onlyMine, user, categoryId, startDate, modifiedEndDate, includeNotInUse, teamId, aggregateBy, isActive);
        }
        
        [Authorize(Roles = "Manager,Employee,Admin")]
        [HttpGet]
        public List<KeyValueDTO> GetWeeklyAggregate(List<LinkDTO> links)
        {
            return repo.GetWeeklyAggregate(links);
        }

        [Authorize(Roles="Manager,Employee,Admin")]
        [HttpGet]
        public int[] GetAggregateLinksByDate(List<LinkDTO> links, Nullable<DateTime> startDate, Nullable<DateTime> endDate)
        {
            return repo.GetAggregateLinksByDate(links, startDate, endDate);
        }

        [Authorize(Roles="Manager,Employee, Admin")]
        [HttpPost]
        public LinkDTO Add(LinkDTO link)
        {
            string user = Membership.GetUser().UserName;
            return repo.AddLink(link, user);
        }

        [Authorize(Roles="Manager,Employee, Admin")]
        [HttpPost]
        public LinkDTO Update(LinkDTO link)
        {
            string user = Membership.GetUser().UserName;
            return repo.UpdateLink(link, user);
        }

        [Authorize(Roles = "Manager,Employee, Admin")]
        [HttpPost]
        public LinkDTO RequestActive(LinkDTO link)
        {
            string user = Membership.GetUser().UserName;
            return repo.RequestActive(link, user);
        }

        [Authorize(Roles="Manager,Admin")]
        [HttpPost]
        public void Activate(LinkDTO link)
        {
            repo.ActivateLink(link);
        }

        [Authorize(Roles="Manager,Admin")]
        [HttpGet]
        public void Delete(int linkId)
        {
            repo.DeleteLink(linkId);
        }
    }
}
