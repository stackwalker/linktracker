using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using p1p.Types.DTO;
using log4net;
using p1p.Business;
using System.Web.Security;

namespace p1p.Controllers
{
    public class ArticleController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        static readonly ArticleRepository repo = new ArticleRepository();

        [Authorize(Roles="Manager,Admin,Employee")]
        [HttpGet]
        public ArticleDTO Get(int id)
        {
            return repo.GetArticleById(id);
        }

        [Authorize(Roles="Manager,Admin,Employee")]
        [HttpGet]
        public List<ArticleSummaryDTO> Search(int projectId, bool onlyMine, bool includePublished, int teamId)
        {
            string username = null;
            if (onlyMine)
            {
                username = Membership.GetUser().UserName;
            }
            List<ArticleDTO> articles = repo.SearchArticles(projectId, username, includePublished, teamId);
            List<ArticleSummaryDTO> summaries = new List<ArticleSummaryDTO>();
            foreach (ArticleDTO article in articles)
            {
                summaries.Add(new ArticleSummaryDTO()
                {
                    Id = article.Id,
                    ArticleStatus = new KeyValueDTO() { Id = article.ArticleStatus.Id, Name = article.ArticleStatus.Name },
                    CreatedBy = article.CreatedBy,
                    Title = article.Title,
                    ProjectId = article.ProjectId,
                    CreatedDate = article.CreatedDate,
                    Project = new ProjectDTO() { Id = article.Project.Id, Name = article.Project.Name }
                });
            }

            return summaries;

        }

        [Authorize(Roles="Manager,Admin,Employee")]
        [HttpPost]
        public void Add(ArticleDTO article)
        {
            string user = Membership.GetUser().UserName;
            article.CreatedBy = user;

            repo.Add(article);
        }

        [Authorize(Roles="Manager,Admin,Employee")]
        [HttpPost]
        public void Update(ArticleDTO article)
        {

            repo.Update(article);
        }

        [Authorize(Roles="Manager,Admin")]
        [HttpGet]
        public void Delete(int articleId)
        {
            repo.Delete(articleId);
        }
    }
}
