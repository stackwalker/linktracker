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
    
    public class TeamController : ApiController
    {
        static readonly TeamRepository repo = new TeamRepository();

        [Authorize(Roles="Manager,Admin")]
        [HttpPost]
        public void Add(Types.DTO.TeamDTO team)
        {
            repo.Add(team);
        }

        [Authorize(Roles="Manager,Admin,Employee")]
        [HttpGet]
        public List<TeamDTO> GetAll()
        {
            return repo.GetAll();
        }

        [Authorize(Roles="Manager,Admin,Employee")]
        [HttpGet]
        public TeamDTO Get(int Id)
        {
            return repo.Get(Id);
        }

        [Authorize(Roles="Manager,Admin,Employee")]
        [HttpGet]
        //TODO For reuse sake let's rename this to GetTeamForUser and return the whole team
        public int GetIdByCurrentUser()
        {
            string user = Membership.GetUser().UserName;
            return repo.GetIdByUser(user);
        }

        [Authorize(Roles="Manager,Admin")]
        [HttpPost]
        public void Update(TeamDTO team)
        {
            repo.UpdateTeam(team);
        }

        [Authorize(Roles="Manager,Admin")]
        [HttpGet]
        public void Delete(int teamId)
        {
            repo.Delete(teamId);
        }
    }
}
