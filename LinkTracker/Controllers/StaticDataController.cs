using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using p1p.Business;
using System.Configuration;
using p1p.Types.DTO;

namespace p1p.Controllers
{
    [Authorize(Roles = "Manager,Admin,Employee,Client")]
    public class StaticDataController : ApiController
    {

        StaticDataRepository repo = new StaticDataRepository();

        [HttpGet]
        public int GetStaticDataVersion()
        {
            return int.Parse(System.Configuration.ConfigurationManager.AppSettings["StaticDataVersion"]);
        }

        [HttpGet]
        public List<KeyValueDTO> GetBillingCycles()
        {
            return repo.GetBillingCycles();
        }

        [HttpGet]
        public List<KeyValueDTO> GetSiteCategories()
        {
            return repo.GetSiteCategories();
        }

        [HttpGet]
        public List<KeyValueDTO> GetLinkLocations()
        {
            return repo.GetLinkLocations();
        }

        [HttpGet]
        public List<KeyValueDTO> GetLinkStatuses()
        {
            return repo.GetLinkStatuses();
        }

        [HttpGet]
        public List<KeyValueDTO> GetOutreachActions()
        {
            return repo.GetOutreachActions();
        }

        [HttpGet]
        public List<KeyValueDTO> GetOutreachTypes()
        {
            return repo.GetOutreachTypes();
        }

        [HttpGet]
        public List<KeyValueDTO> GetLinkTypes()
        {
            return repo.GetLinkTypes();
        }

        [HttpGet]
        public List<KeyValueDTO> GetLinkStrategies()
        {
            return repo.GetLinkStrategies();
        }

        [HttpGet]
        public List<KeyValueDTO> GetLinkBuildingModes()
        {
            return repo.GetLinkBuildingModes();
        }

        [HttpGet]
        public List<KeyValueDTO> GetArticleStatuses()
        {
            return repo.GetArticleStatuses();
        }
    }
}
