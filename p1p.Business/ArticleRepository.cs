using p1p.Types.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace p1p.Business
{
    public class ArticleRepository
    {
        public ArticleDTO GetArticleById(int id)
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                ArticleDTO article = (ArticleDTO)P1PObjectMapper.Convert(ctx.Articles.Single(a => a.Id == id), typeof(ArticleDTO));
                p1p.Data.ProjectArticleXREF xref = ctx.ProjectArticleXREFs.Single(x => x.ArticleId == id);
                article.Project = new ProjectDTO() {Id = xref.ProjectId};
                return article;
            }
        }

        public List<ArticleDTO> SearchArticles(int projectId, string username, bool includePublished, int teamId)
        {
            Data.ArticleDAO articleDAO = new Data.ArticleDAO();
            return articleDAO.Search(projectId, username, includePublished, teamId);
        }

        public void Add(ArticleDTO article)
        {
            p1p.Data.Article newArticle;
            p1p.Data.Article mdlArticle = (p1p.Data.Article)P1PObjectMapper.Convert(article, typeof(p1p.Data.Article));
            mdlArticle.CreatedDate = DateTime.Now;
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                newArticle = ctx.Articles.Add(mdlArticle);
                
                ctx.ProjectArticleXREFs.Add(new Data.ProjectArticleXREF() { ProjectId = article.Project.Id, ArticleId = newArticle.Id });
                ctx.SaveChanges();
            }
        }

        public void Update(ArticleDTO article)
        {
            p1p.Data.Article mdlArticle = (p1p.Data.Article)P1PObjectMapper.Convert(article, typeof(p1p.Data.Article));
            p1p.Data.Article articleMatch;
            p1p.Data.ProjectArticleXREF xrefMatch;
            p1p.Data.ProjectArticleXREF mdlxref;
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                articleMatch = ctx.Articles.Single(a => article.Id == a.Id);
                ctx.Entry(articleMatch).CurrentValues.SetValues(mdlArticle);

                xrefMatch = ctx.ProjectArticleXREFs.Single(x => x.ArticleId == article.Id);
                mdlxref = xrefMatch;
                mdlxref.ProjectId = article.Project.Id;
                ctx.Entry(xrefMatch).CurrentValues.SetValues(mdlxref);
                ctx.SaveChanges();
            }
        }

        public void Delete(int articleId)
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                try
                {
                    ctx.ProjectArticleXREFs.Remove(ctx.ProjectArticleXREFs.Single(xr => xr.ArticleId == articleId));
                    ctx.SaveChanges();
                }
                catch (System.Data.Entity.Infrastructure.DbUpdateException ex)
                {
                    throw new Exception("You cannot delete an article that is used in a target or link.");
                }
                try
                {
                    ctx.Articles.Remove(ctx.Articles.Single(a => a.Id == articleId));
                    ctx.SaveChanges();
                }
                catch (System.Data.Entity.Infrastructure.DbUpdateException ex)
                {
                    throw new Exception("You cannot delete this article.");
                }
                
            }
        }

    }
}
