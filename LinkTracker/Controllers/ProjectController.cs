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
    public class ProjectController : ApiController
    {
        static readonly ProjectsRepository repo = new ProjectsRepository();
        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        [Authorize(Roles="Manager,Employee,Admin")]
        [HttpGet]
        public List<ProjectDTO> GetAll()
        {
            return repo.GetAll();
        }

        [Authorize(Roles="Manager,Employee,Admin")]
        [HttpGet]
        public List<ProjectDTO> GetAllActive()
        {
            return repo.GetAllActive();
        }

        [Authorize(Roles="Manager,Employee,Admin")]
        [HttpGet]
        public ProjectDTO Get(int id)
        {
            return repo.GetProject(id);
        }

        [Authorize(Roles="Manager,Employee,Admin")]
        [HttpGet]
        public List<ProjectDTO> GetProjectsByAccount(int accountId)
        {
            return repo.GetProjectsForAccount(accountId);
        }

        [Authorize(Roles="Manager,Employee,Client,Admin")]
        [HttpGet]
        public List<ProjectDTO> GetProjectsForUser()
        {
            string user = Membership.GetUser().UserName;
            return repo.GetProjectsForUser(user);
        }

        [Authorize(Roles="Manager,Employee, Admin")]
        [HttpGet]
        public List<ProjectDTO> GetProjectsForCurrentUserTeam()
        {
            string username = Membership.GetUser().UserName;
            p1p.Business.ProjectsRepository projRepo = new ProjectsRepository();
            p1p.Business.TeamRepository teamRepo = new TeamRepository();

            TeamDTO team = teamRepo.GetByUser(username);

            if (team != null)
            {
                return projRepo.GetProjectsForTeam(team.Id);
            }
            else
            {
                return projRepo.GetAll();
            }
        }

        [Authorize(Roles="Manager,Admin")]
        [HttpPost]
        public void Add(ProjectDTO item)
        {
            repo.AddProject(item);
        }

        [Authorize(Roles="Manager,Admin")]
        [HttpPost]
        public void Update(ProjectDTO item)
        {
            repo.UpdateProject(item);
        }

        [Authorize(Roles="Manager,Admin")]
        [HttpGet]
        public void Delete(int projectId)
        {
            repo.RemoveProject(projectId);
        }

        [Authorize(Roles="Manager,Admin")]
        [HttpGet]
        public bool IsDuplicate(string projectName)
        {
            return repo.IsDuplicate(projectName);
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        [HttpGet]
        public List<SocialAccountDTO> GetSocialAccountsForProject(int projectId)
        {
            return repo.GetSocialAccountsForProject(projectId);
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        [HttpPost]
        public void AddSocialAccount(SocialAccountDetailDTO item)
        {
            repo.AddSocialAccount(item);
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        [HttpPost]
        public void UpdateSocialAccount(SocialAccountDTO item)
        {
            repo.UpdateSocialAccount(item);
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        [HttpGet]
        public void DeleteSocialAccount(int socialAccountId)
        {
            repo.DeleteSocialAccount(socialAccountId);
        }

        [Authorize(Roles="Manager,Admin,Employee")]
        [HttpGet]
        public List<PersonaDTO> GetPersonasForProject(int projectId)
        {
            return repo.GetPersonasForProject(projectId);
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        [HttpPost]
        public void AddPersona(PersonaDetailDTO item)
        {
            repo.AddPersona(item);
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        [HttpPost]
        public void UpdatePersona(PersonaDTO item)
        {
            repo.UpdatePersona(item);
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        [HttpGet]
        public List<SocialAccountDTO> GetSocialAccountsForPersona(int personaId)
        {
            return repo.GetSocialAccountsForPersona(personaId);
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        [HttpPost]
        public void AddPersonaSocialAccount(SocialAccountDetailDTO item) {
            repo.AddPersonaSocialAccount(item);
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        [HttpGet]
        public void DeletePersonaSocialAccount(int socialAccountId)
        {
            repo.DeletePersonaSocialAccount(socialAccountId);
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        [HttpGet]
        public void DeletePersona(int personaId)
        {
            repo.DeletePersona(personaId);
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        [HttpPost]
        public void AddKeyword(KeywordDetailDTO item)
        {
            repo.AddKeyword(item);
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        [HttpGet]
        public void AddKeywordToLandingPage(int landingPageId, int keywordId, int priority)
        {
            repo.AddKeywordToLandingPage(landingPageId, keywordId, priority);
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        [HttpGet]
        public void RemoveKeywordFromLandingPage(int landingPageId, int keywordId)
        {
            repo.RemoveKeywordFromLandingPage(landingPageId, keywordId);
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        [HttpGet]
        public List<LandingPageDTO> GetLandingPagesForProject(int projectId)
        {
            return repo.GetLandingPagesForProject(projectId);
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        [HttpGet]
        public List<KeywordDTO> GetKeywordsForLandingPages(int projectId)
        {
            return repo.GetKeywordsForLandingPages(projectId);
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        [HttpGet]
        public List<KeywordDTO> GetKeywordsForProject(int projectId)
        {
            return repo.GetKeywordsForProject(projectId);
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        [HttpGet]
        public List<KeywordDTO> GetKeywordsForLandingPage(int landingPageId)
        {
            return repo.GetKeywordsForLandingPage(landingPageId);
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        [HttpPost]
        public void AddLandingPage(LandingPageDetailDTO item) {
            repo.AddLandingPage(item);
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        [HttpPost]
        public void UpdateLandingPage(LandingPageDTO item)
        {
            repo.UpdateLandingPage(item);
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        [HttpGet]
        public void DeleteLandingPage(int landingPageId)
        {
            repo.DeleteLandingPage(landingPageId);
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        [HttpPost]
        public void UpdateKeyword(KeywordDetailDTO item)
        {
            repo.UpdateKeyword(item);
        }

        [Authorize(Roles = "Manager,Admin,Employee")]
        [HttpGet]
        public void DeleteKeyword(int keywordId)
        {
            repo.DeleteKeyword(keywordId);
        }

        [Authorize (Roles = "Manager,Admin,Employee")]
        [HttpGet]
        public ProjectDTO AddCategoryToProject(int projectId, int categoryId)
        {
            return repo.AddCategoryToProject(projectId, categoryId);
        }

        [Authorize (Roles = "Manager,Admin,Employee")]
        [HttpGet]
        public ProjectDTO RemoveCategoryFromProject(int projectId, int categoryId)
        {
            return repo.RemoveCategoryFromProject(projectId, categoryId);
        }
    }
}
