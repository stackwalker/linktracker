using System;
using System.Collections.Generic;
using System.Linq;
using p1p.Data;
using p1p.Types.DTO;
using log4net;

namespace p1p.Business
{
    public class ProjectsRepository
    {
        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public List<ProjectDTO> GetAll()
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                List<ProjectDTO> projects = (from p in ctx.Projects orderby p.Name select p)
                    .AsEnumerable()
                    .Select(p => (ProjectDTO)P1PObjectMapper.Convert(p, typeof(ProjectDTO))).ToList<ProjectDTO>();
                List<OrderTeamXREF> xrefs = (from x in ctx.OrderTeamXREFs select x).ToList<OrderTeamXREF>();
                foreach (ProjectDTO project in projects)
                {
                    List<OrderTeamXREF> matchingxref = xrefs.Where(x => x.OrderId == project.Id).ToList<OrderTeamXREF>();
                    if (matchingxref.Count > 0)
                    {
                        OrderTeamXREF xref = matchingxref[0];
                        project.Team.Id = xref.Team.Id;
                        project.Team.Name = xref.Team.Name;
                    }
                }
                return projects;
            }
        }

        public List<ProjectDTO> GetAllActive()
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return (from p in ctx.Projects where p.IsActive orderby p.Name select p)
                    .AsEnumerable()
                    .Select(p => (ProjectDTO)P1PObjectMapper.Convert(p, typeof(ProjectDTO))).ToList<ProjectDTO>();
            }
        }

        public ProjectDTO GetProject(int id)
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return (ProjectDTO)P1PObjectMapper.Convert(ctx.Projects.Single(p => p.Id == id), typeof(ProjectDTO));
            }
        }

        public ProjectDTO GetProjectByName(string name)
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return (ProjectDTO)P1PObjectMapper.Convert(ctx.Projects.Single(p => p.Name.Equals(name)), typeof(ProjectDTO));
            }           
        }

        public List<ProjectDTO> GetProjectsForAccount(int accountId)
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return (from p in ctx.Projects where p.CustomerId == accountId orderby p.Name select p)
                    .AsEnumerable()
                    .Select(p => (ProjectDTO)P1PObjectMapper.Convert(p, typeof(ProjectDTO))).ToList<ProjectDTO>();
            }
        }

        public List<ProjectDTO> GetProjectsForUser(string user)
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return (from p in ctx.Projects
                        join c in ctx.Customers on p.CustomerId equals c.Id
                        where c.Username.Equals(user)
                        select p)
                        .AsEnumerable()
                        .Select(p => (ProjectDTO)P1PObjectMapper.Convert(p, typeof(ProjectDTO))).ToList<ProjectDTO>();
            }
        }

        public List<ProjectDTO> GetProjectsForTeam(int teamId)
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return (from o in ctx.OrderTeamXREFs where o.TeamId == teamId orderby o.Project.Name select o.Project)
                    .AsEnumerable()
                    .Select(p => (ProjectDTO)P1PObjectMapper.Convert(p, typeof(ProjectDTO))).ToList<ProjectDTO>();                                    
            }
        }

        public void AddProject(ProjectDTO item)
        {
            p1p.Data.Project mdlProject = (p1p.Data.Project)P1PObjectMapper.Convert(item, typeof(p1p.Data.Project));
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                if (!IsDuplicate(mdlProject.Name))
                {
                    mdlProject.DateCreated = DateTime.Now;
                    mdlProject.InsertDate = DateTime.Now;
                    Project newproject = ctx.Projects.Add(mdlProject);
                    ctx.SaveChanges();
                    DateTime insertDate = DateTime.Now;
                    if (item.Team != null && item.Team.Id != 0)
                    {
                        OrderTeamXREF xref = new OrderTeamXREF()
                        {
                            TeamId = item.Team.Id,
                            OrderId = newproject.Id,
                            InsertDate = insertDate
                        };

                        ctx.OrderTeamXREFs.Add(xref);
                    }
                    if (item.Categories != null && item.Categories.Count > 0)
                    {
                        foreach (KeyValueDTO c in item.Categories)
                        {
                            ctx.OrderCategoryXREFs.Add(new OrderCategoryXREF()
                            {
                                ProjectId = newproject.Id,
                                CategoryId = c.Id
                            });
                        }
                    }
                    ctx.SaveChanges();
                }
                else
                {
                    throw new Exception("A project already exists with this name");
                }

               
            }
        }

        public void UpdateProject(ProjectDTO item)
        {
            p1p.Data.Project mdlProject = (p1p.Data.Project)P1PObjectMapper.Convert(item, typeof(p1p.Data.Project));
            p1p.Data.Project match;
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                match = ctx.Projects.Single(p => item.Id == p.Id);
                if (match.IsActive && !mdlProject.IsActive)
                {
                    List<Link> killLinks = ctx.Links.Where(l => l.ProjectId == item.Id
                                                            && l.LinkStatusId != 5
                                                            && l.LinkStatusId != 8
                                                            && l.LinkStatusId != 9
                                                            && l.LinkStatusId != 10
                                                            && l.LinkStatusId != 11
                                                            && l.LinkStatusId != 12).ToList<Link>();
                    foreach (Link link in killLinks)
                    {
                        Link deadLink = link;
                        deadLink.LinkStatusId = 8;
                        ctx.Entry(link).CurrentValues.SetValues(deadLink);
                    }
                    ctx.SaveChanges();
                }

                ctx.Entry(match).CurrentValues.SetValues(mdlProject);
                ctx.SaveChanges();

                List<OrderTeamXREF> matchingxref = ctx.OrderTeamXREFs.Where(x => x.OrderId == item.Id).ToList<OrderTeamXREF>();
                if (matchingxref.Count > 0)
                {
                    DateTime InsertDate = DateTime.Now;
                    OrderTeamXREF xref = matchingxref[0];
                    ctx.OrderTeamXREFs.Remove(xref);
                    OrderTeamXREF newxref = new OrderTeamXREF() { TeamId = item.Team.Id, OrderId = item.Id, InsertDate = InsertDate };
                    ctx.OrderTeamXREFs.Add(newxref);
                    ctx.SaveChanges();
                }
                else
                {
                    if (item.Team.Id > 0)
                    {
                        DateTime InsertDate = DateTime.Now;
                        OrderTeamXREF newxref = new OrderTeamXREF() { TeamId = item.Team.Id, OrderId = item.Id, InsertDate = InsertDate };
                        ctx.OrderTeamXREFs.Add(newxref);
                        ctx.SaveChanges();
                    } 
                }
            }
        }

        public void RemoveProject(int projectId)
        {
            p1p.Data.Project proj;
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                proj = ctx.Projects.Single(p => p.Id == projectId);
                try
                {
                    List<OrderTeamXREF> matchingxref = ctx.OrderTeamXREFs.Where(x => x.OrderId == projectId).ToList<OrderTeamXREF>();
                    if (matchingxref.Count > 0)
                    {
                        OrderTeamXREF xref = matchingxref[0];
                        ctx.OrderTeamXREFs.Remove(xref);
                        ctx.SaveChanges();
                    }

                    ctx.Projects.Remove(proj);
                    ctx.SaveChanges();
                }
                catch (System.Data.Entity.Infrastructure.DbUpdateException ex)
                {
                    if ("The DELETE statement conflicted with the REFERENCE constraint \"FK_dbo.LandingPages_dbo.Projects_ProjectId\". The conflict occurred in database \"p1pLinkTracker\", table \"dbo.LandingPages\", column 'ProjectId'.\r\nThe statement has been terminated.".Equals(ex.InnerException.InnerException.Message))
                    {
                        throw new Exception("You can't delete a project that has targets assigned to it.");
                    }
                    else
                    {
                        throw new Exception("Could not delete Project.");
                    }
                }
            }
        }

        public ProjectDTO AddCategoryToProject(int projectId, int categoryId)
        {
            p1p.Data.OrderCategoryXREF x = new OrderCategoryXREF()
            {
                ProjectId = projectId,
                CategoryId = categoryId
            };

            using (P1PContext ctx = new P1PContext())
            {
                ctx.OrderCategoryXREFs.Add(x);
                ctx.SaveChanges();
            }
            return GetProject(projectId);
        }

        public ProjectDTO RemoveCategoryFromProject(int projectId, int categoryId)
        {
            OrderCategoryXREF xref;
            using (P1PContext ctx = new P1PContext())
            {
                xref = ctx.OrderCategoryXREFs.Single(x => x.CategoryId == categoryId && x.ProjectId == projectId);
                ctx.OrderCategoryXREFs.Remove(xref);
                ctx.SaveChanges();
            }
            return GetProject(projectId);
        }

        public bool IsDuplicate(string projectName)
        {
            bool isDuplicate = false;
            p1p.Data.Project proj;
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                proj = ctx.Projects.FirstOrDefault(p => p.Name.Equals(projectName));
                if (proj != null)
                {
                    isDuplicate = true;
                }
            }
            return isDuplicate;
        }

        public List<SocialAccountDTO> GetSocialAccountsForProject(int projectId)
        {
            using (P1PContext ctx = new P1PContext())
            {
                return (from x in ctx.ProjectSocialAccountXREFs where x.ProjectId == projectId select x.SocialAccount)
                    .AsEnumerable()
                    .Select(s => (SocialAccountDTO)P1PObjectMapper.Convert(s, typeof(SocialAccountDTO))).ToList<SocialAccountDTO>();
            } 
        }

        public void AddSocialAccount(SocialAccountDetailDTO item)
        {
            p1p.Data.SocialAccount newSocialAccount;
            p1p.Data.SocialAccount mdlSocialAccount = (p1p.Data.SocialAccount)P1PObjectMapper.Convert(item, typeof(p1p.Data.SocialAccount));
            mdlSocialAccount.InsertDate = DateTime.Now;
            using (P1PContext ctx = new P1PContext())
            {
                newSocialAccount = ctx.SocialAccounts.Add(mdlSocialAccount);
                ctx.ProjectSocialAccountXREFs.Add(new ProjectSocialAccountXREF()
                {
                    ProjectId = item.ProjectId,
                    SocialAccountId = item.Id,
                    InsertDate = DateTime.Now
                });
                ctx.SaveChanges();
            }
        }

        public void UpdateSocialAccount(SocialAccountDTO item)
        {
            p1p.Data.SocialAccount mdlAccount = (p1p.Data.SocialAccount)P1PObjectMapper.Convert(item, typeof(p1p.Data.SocialAccount));
            p1p.Data.SocialAccount match;
            using (P1PContext ctx = new P1PContext())
            {
                match = ctx.SocialAccounts.Single(s => s.Id == mdlAccount.Id);
                mdlAccount.InsertDate = match.InsertDate;
                ctx.Entry(match).CurrentValues.SetValues(mdlAccount);
                ctx.SaveChanges();
            }
        }

        public void DeleteSocialAccount(int socialAccountId)
        {
            p1p.Data.SocialAccount acct;
            p1p.Data.ProjectSocialAccountXREF xref;
            using (P1PContext ctx = new P1PContext())
            {
                xref = ctx.ProjectSocialAccountXREFs.FirstOrDefault(x => x.SocialAccountId == socialAccountId);
                ctx.ProjectSocialAccountXREFs.Remove(xref);
                acct = ctx.SocialAccounts.FirstOrDefault(a => a.Id == socialAccountId);
                ctx.SocialAccounts.Remove(acct);
                ctx.SaveChanges();
            }
        }

        public List<PersonaDTO> GetPersonasForProject(int projectId)
        {
            using (P1PContext ctx = new P1PContext())
            {
                return (from x in ctx.ProjectPersonaXREFs where x.ProjectId == projectId select x.Persona)
                    .AsEnumerable()
                    .Select(p => (PersonaDTO)P1PObjectMapper.Convert(p, typeof(PersonaDTO))).ToList<PersonaDTO>();
            }
        }

        public void AddPersona(PersonaDetailDTO item)
        {
            p1p.Data.Persona newPersona;
            p1p.Data.Persona mdlPersona = (p1p.Data.Persona)P1PObjectMapper.Convert(item, typeof(p1p.Data.Persona));
            mdlPersona.InsertDate = DateTime.Now;
            using (P1PContext ctx = new P1PContext())
            {
                newPersona = ctx.Personas.Add(mdlPersona);
                ctx.ProjectPersonaXREFs.Add(new ProjectPersonaXREF()
                {
                    ProjectId = item.ProjectId,
                    PersonaId = newPersona.Id,
                    InsertDate = DateTime.Now
                });
                ctx.SaveChanges();
            }
        }

        public void UpdatePersona(PersonaDTO item)
        {
            p1p.Data.Persona mdlPersona = (p1p.Data.Persona)P1PObjectMapper.Convert(item, typeof(p1p.Data.Persona));
            p1p.Data.Persona match;
            using (P1PContext ctx = new P1PContext())
            {
                match = ctx.Personas.Single(p => p.Id == mdlPersona.Id);
                mdlPersona.InsertDate = match.InsertDate;
                ctx.Entry(match).CurrentValues.SetValues(mdlPersona);
                ctx.SaveChanges();
            }
        }

        public List<SocialAccountDTO> GetSocialAccountsForPersona(int personaId)
        {
            using (P1PContext ctx = new P1PContext())
            {
                return (from x in ctx.PersonaSocialAccountXREFs where x.PersonaId == personaId select x.SocialAccount)
                    .AsEnumerable()
                    .Select(s => (SocialAccountDTO)P1PObjectMapper.Convert(s, typeof(SocialAccountDTO))).ToList<SocialAccountDTO>();
            }
        }

        public void DeletePersonaSocialAccount(int socialAccountId)
        {
            p1p.Data.SocialAccount acct;
            p1p.Data.PersonaSocialAccountXREF xref;
            using (P1PContext ctx = new P1PContext())
            {
                xref = ctx.PersonaSocialAccountXREFs.FirstOrDefault(x => x.SocialAccountId == socialAccountId);
                ctx.PersonaSocialAccountXREFs.Remove(xref);
                acct = ctx.SocialAccounts.FirstOrDefault(a => a.Id == socialAccountId);
                ctx.SocialAccounts.Remove(acct);
                ctx.SaveChanges();
            }
        }

        public void AddPersonaSocialAccount(SocialAccountDetailDTO item)
        {
            p1p.Data.SocialAccount newSocialAccount;
            p1p.Data.SocialAccount mdlSocialAccount = (p1p.Data.SocialAccount)P1PObjectMapper.Convert(item, typeof(p1p.Data.SocialAccount));
            mdlSocialAccount.InsertDate = DateTime.Now;
            using (P1PContext ctx = new P1PContext())
            {
                newSocialAccount = ctx.SocialAccounts.Add(mdlSocialAccount);
                ctx.PersonaSocialAccountXREFs.Add(new PersonaSocialAccountXREF()
                {
                    PersonaId = item.PersonaId,
                    SocialAccountId = newSocialAccount.Id,
                    InsertDate = DateTime.Now
                });
                ctx.SaveChanges();
            }
        }       

        public void DeletePersona(int personaId)
        {
            p1p.Data.Persona persona;
            p1p.Data.ProjectPersonaXREF pxref;
            List<p1p.Data.PersonaSocialAccountXREF> xrefs;
            using (P1PContext ctx = new P1PContext())
            {
                persona = ctx.Personas.Single(p => p.Id == personaId);
                xrefs = ctx.PersonaSocialAccountXREFs.Where(x => x.PersonaId == personaId).ToList<p1p.Data.PersonaSocialAccountXREF>();
                foreach (PersonaSocialAccountXREF x in xrefs)
                {
                    ctx.PersonaSocialAccountXREFs.Remove(x);
                }
                pxref = ctx.ProjectPersonaXREFs.Single(p => p.Id == personaId);
                ctx.ProjectPersonaXREFs.Remove(pxref);
                ctx.Personas.Remove(persona);
                ctx.SaveChanges();
            }
        }

        public void AddKeyword(KeywordDetailDTO item)
        {
            p1p.Data.Keyword newKeyword;
            p1p.Data.Keyword mdlKeyword = (p1p.Data.Keyword)P1PObjectMapper.Convert(item, typeof(p1p.Data.Keyword));
            mdlKeyword.InsertDate = DateTime.Now;
            using (P1PContext ctx = new P1PContext())
            {
                newKeyword = ctx.Keywords.Add(mdlKeyword);
                ctx.ProjectKeywordXREFs.Add(new ProjectKeywordXREF()
                {
                    ProjectId = item.ProjectId,
                    KeywordId = newKeyword.Id,
                    KeywordPriority = item.ProjectPriority,
                    InsertDate = DateTime.Now
                });
                ctx.SaveChanges();
            }
        }

        public void AddKeywordToLandingPage(int landingPageId, int keywordId, int priority)
        {
            using (P1PContext ctx = new P1PContext())
            {
                if (ctx.LandingPageKeywordXREFs.FirstOrDefault(x => x.KeywordId == keywordId && x.LandingPageId == landingPageId) == null)
                {
                    ctx.LandingPageKeywordXREFs.Add(new LandingPageKeywordXREF()
                    {
                        LandingPageId = landingPageId,
                        KeywordId = keywordId,
                        InsertDate = DateTime.Now,
                        KeywordPriority = priority
                    });
                    ctx.SaveChanges();
                }
            }
        }

        public void RemoveKeywordFromLandingPage(int landingPageId, int keywordId)
        {
            LandingPageKeywordXREF xref;
            using (P1PContext ctx = new P1PContext())
            {
                xref = ctx.LandingPageKeywordXREFs.FirstOrDefault(x => x.LandingPageId == landingPageId && x.KeywordId == keywordId);
                ctx.LandingPageKeywordXREFs.Remove(xref);
                ctx.SaveChanges();
            }
        }

        public List<LandingPageDTO> GetLandingPagesForProject(int projectId)
        {
            using (P1PContext ctx = new P1PContext()) {
                return (from x in ctx.ProjectLandingPageXREFs where x.ProjectId == projectId select x.LandingPage)
                    .AsEnumerable()
                    .Select(l => (LandingPageDTO)P1PObjectMapper.Convert(l, typeof(LandingPageDTO))).ToList<LandingPageDTO>();
            }
        }

        public List<KeywordDTO> GetKeywordsForProject(int projectId)
        {
            using (P1PContext ctx = new P1PContext())
            {
                return (from x in ctx.ProjectKeywordXREFs where x.ProjectId == projectId select x.Keyword)
                    .AsEnumerable()
                    .Select(k => (KeywordDTO)P1PObjectMapper.Convert(k, typeof(KeywordDTO))).ToList<KeywordDTO>();
            }
        }

        public List<KeywordDTO> GetKeywordsForLandingPages(int projectId)
        {
            List<LandingPageKeywordXREF> xrefs;
            List<KeywordDTO> keywords = new List<KeywordDTO>();
            using (P1PContext ctx = new P1PContext())
            {
                xrefs = (from xl in ctx.ProjectLandingPageXREFs where xl.ProjectId == projectId 
                            join xk in ctx.LandingPageKeywordXREFs on xl.LandingPageId equals xk.LandingPageId
                            select xk).ToList<LandingPageKeywordXREF>();
                foreach (LandingPageKeywordXREF x in xrefs)
                {
                    keywords.Add(new KeywordDTO()
                    {
                        Id = x.Keyword.Id,
                        LandingPageId = x.LandingPageId,
                        LandingPagePriority = x.KeywordPriority,
                        Text = x.Keyword.Text
                    });
                }
                return keywords;
            }
        }

        public List<KeywordDTO> GetKeywordsForLandingPage(int landingPageId)
        {
            using (P1PContext ctx = new P1PContext())
            {
                return (from x in ctx.LandingPageKeywordXREFs where x.LandingPageId == landingPageId select x.Keyword)
                    .AsEnumerable()
                    .Select(k => (KeywordDTO)P1PObjectMapper.Convert(k, typeof(KeywordDTO))).ToList<KeywordDTO>();
            }
        }

        public void AddLandingPage(LandingPageDetailDTO item)
        {
            p1p.Data.LandingPage newLandingPage;
            p1p.Data.LandingPage mdlLandingPage = (p1p.Data.LandingPage)P1PObjectMapper.Convert(item, typeof(p1p.Data.LandingPage));
            mdlLandingPage.InsertDate = DateTime.Now;
            using (P1PContext ctx = new P1PContext())
            {
                newLandingPage = ctx.LandingPages.Add(mdlLandingPage);
                ctx.ProjectLandingPageXREFs.Add(new ProjectLandingPageXREF()
                {
                    ProjectId = item.ProjectId,
                    LandingPageId = newLandingPage.Id,
                    LandingPagePriority = item.Priority,
                    InsertDate = DateTime.Now
                });

                ctx.SaveChanges();
            }
        }

        public void UpdateLandingPage(LandingPageDTO item)
        {
            p1p.Data.LandingPage mdlLandingPage = (p1p.Data.LandingPage)P1PObjectMapper.Convert(item, typeof(p1p.Data.LandingPage));
            p1p.Data.LandingPage match;
            p1p.Data.ProjectLandingPageXREF xmatch;
            p1p.Data.ProjectLandingPageXREF newxref;
            using (P1PContext ctx = new P1PContext())
            {
                match = ctx.LandingPages.Single(l => l.Id == item.Id);
                mdlLandingPage.InsertDate = match.InsertDate;
                ctx.Entry(match).CurrentValues.SetValues(mdlLandingPage);
                xmatch = ctx.ProjectLandingPageXREFs.Single(x => x.LandingPageId == item.Id);
                newxref = xmatch;
                newxref.LandingPagePriority = item.Priority;
                ctx.Entry(xmatch).CurrentValues.SetValues(newxref);
                ctx.SaveChanges();
            }
        }

        public void DeleteLandingPage(int landingPageId)
        {
            p1p.Data.LandingPage landingPage;
            p1p.Data.ProjectLandingPageXREF pxref;
            List<p1p.Data.LandingPageKeywordXREF> kxrefs;
            using (P1PContext ctx = new P1PContext())
            {
                landingPage = ctx.LandingPages.Single(l => l.Id == landingPageId);
                pxref = ctx.ProjectLandingPageXREFs.Single(x => x.LandingPageId == landingPageId);
                kxrefs = (from x in ctx.LandingPageKeywordXREFs where x.LandingPageId == landingPageId select x).ToList<LandingPageKeywordXREF>();
                if (kxrefs.Count > 0)
                {
                    foreach (LandingPageKeywordXREF x in kxrefs)
                    {
                        ctx.LandingPageKeywordXREFs.Remove(x);
                    }
                }
                ctx.ProjectLandingPageXREFs.Remove(pxref);
                ctx.LandingPages.Remove(landingPage);
                ctx.SaveChanges();
            }
        }

        public void UpdateKeyword(KeywordDetailDTO item)
        {
            p1p.Data.Keyword mdlKeyword = (p1p.Data.Keyword)P1PObjectMapper.Convert(item, typeof(p1p.Data.Keyword));
            p1p.Data.Keyword match;
            p1p.Data.ProjectKeywordXREF xmatch;
            p1p.Data.ProjectKeywordXREF newxref;
            p1p.Data.LandingPageKeywordXREF lpxmatch;
            p1p.Data.LandingPageKeywordXREF newlpxref;
            using (P1PContext ctx = new P1PContext())
            {
                match = ctx.Keywords.Single(k => k.Id == item.Id);
                mdlKeyword.InsertDate = match.InsertDate;
                ctx.Entry(match).CurrentValues.SetValues(mdlKeyword);
                xmatch = ctx.ProjectKeywordXREFs.Single(x => x.KeywordId == item.Id);
                newxref = xmatch;
                newxref.KeywordPriority = item.ProjectPriority;

                if (item.LandingPagePriority != 0)
                {
                    lpxmatch = ctx.LandingPageKeywordXREFs.FirstOrDefault(l => l.KeywordId == item.Id && l.LandingPageId == item.LandingPageId);
                    if (lpxmatch != null)
                    {
                        newlpxref = lpxmatch;
                        newlpxref.KeywordPriority = item.LandingPagePriority;
                        ctx.Entry(lpxmatch).CurrentValues.SetValues(newlpxref);
                    }
                }
                ctx.SaveChanges();
            }
        }

        public void DeleteKeyword(int keywordId)
        {
            p1p.Data.Keyword keyword;
            List<p1p.Data.LandingPageKeywordXREF> lxrefs;
            p1p.Data.ProjectKeywordXREF pxref;
            using (P1PContext ctx = new P1PContext())
            {
                keyword = ctx.Keywords.Single(k => k.Id == keywordId);
                pxref = ctx.ProjectKeywordXREFs.Single(x => x.KeywordId == keywordId);
                lxrefs = (from x in ctx.LandingPageKeywordXREFs where x.KeywordId == keywordId select x).ToList<LandingPageKeywordXREF>();
                if (lxrefs.Count > 0)
                {
                    foreach (LandingPageKeywordXREF x in lxrefs)
                    {
                        ctx.LandingPageKeywordXREFs.Remove(x);
                    }
                }
                ctx.ProjectKeywordXREFs.Remove(pxref);
                ctx.Keywords.Remove(keyword);
                ctx.SaveChanges();
            }
        }
    }
}