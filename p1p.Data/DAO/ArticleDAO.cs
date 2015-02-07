using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Objects;
using p1p.Types.DTO;

namespace p1p.Data
{
    public class ArticleDAO
    {

        public List<ArticleDTO> Search(int projectId, string username, bool includePublished, int teamId)
        {
            ObjectResult<Article> articles;
            List<ArticleDTO> dtoArticles = new List<ArticleDTO>();
            using (P1PContext ctx = new P1PContext())
            {
                
                articles = ctx.SearchArticles(projectId, username, includePublished, teamId);
                foreach (Article article in articles)
                {
                    dtoArticles.Add(new ArticleDTO(){ Id = article.Id,
                        Title = article.Title,
                        Content = article.Content,
                        CreatedBy = article.CreatedBy,
                        CreatedDate = article.CreatedDate,
                        ArticleStatus = new KeyValueDTO(){ Id = article.ArticleStatus.Id, Name = article.ArticleStatus.Name },
                        Project = new ProjectDTO() { Id = article.ProjectArticleXREFs.First().Project.Id, Name = article.ProjectArticleXREFs.First().Project.Name }
                    });                   
                }
            }
            

            

            return dtoArticles;
        }
    }
}
