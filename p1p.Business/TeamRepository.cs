using System;
using System.Collections.Generic;
using System.Linq;
using p1p.Data;
using p1p.Types.DTO;

namespace p1p.Business
{
    public class TeamRepository
    {
        public void Add(Types.DTO.TeamDTO team)
        {
            Team mdlTeam = (Team)P1PObjectMapper.Convert(team, typeof(Team));
            mdlTeam.InsertDate = DateTime.Now;

            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                ctx.Teams.Add(mdlTeam);
                ctx.SaveChanges();
            }
        }

        public List<TeamDTO> GetAll()
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return (from t in ctx.Teams select t)
                    .AsEnumerable()
                    .Select(t => (TeamDTO)P1PObjectMapper.Convert(t, typeof(TeamDTO))).ToList<TeamDTO>();
            }
        }

        public TeamDTO Get(int id)
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return (TeamDTO)P1PObjectMapper.Convert(ctx.Teams.Single(t => t.Id == id), typeof(TeamDTO));
            }
        }

        public TeamDTO GetByUser(string username)
        {
            using (P1PContext ctx = new P1PContext())
            {
                return (from e in ctx.Employees 
                        join t in ctx.EmployeeTeamXREFs on e.Id equals t.EmployeeId
                        where e.Username.Equals(username)
                        select t.Team)
                    .AsEnumerable()
                    .Select(t => (TeamDTO)P1PObjectMapper.Convert(t, typeof(TeamDTO))).FirstOrDefault();
            }
        }
        //TODO Don't get the ID, get the whole team and use only the ID if you need it.  This is not very reusable
        public int GetIdByUser(string user)
        {
            EmployeeTeamXREF xref;
            Employee employee;
            int id;
            int teamId;
            using (P1PContext ctx = new P1PContext())
            {
                employee = ctx.Employees.FirstOrDefault(e => e.Username.Equals(user));
                if (employee != null) {
                    id = employee.Id;
                }
                else {
                    id = 0;
                }
                xref = ctx.EmployeeTeamXREFs.FirstOrDefault(x => x.EmployeeId == id);
            }

            if (xref != null)
            {
                teamId = xref.TeamId;
            }
            else
            {
                teamId = 0;
            }

            return teamId;
        }

        public TeamDTO GetTeamByName(string name)
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return (TeamDTO)P1PObjectMapper.Convert(ctx.Teams.Single(t => t.Name.Equals(name)), typeof(TeamDTO));
            }
        }

        public void UpdateTeam(TeamDTO team)
        {
            p1p.Data.Team mdlTeam = (p1p.Data.Team)P1PObjectMapper.Convert(team, typeof(p1p.Data.Team));
            p1p.Data.Team match;
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                match = ctx.Teams.Single(t => t.Id == team.Id);
                ctx.Entry(match).CurrentValues.SetValues(mdlTeam);
                ctx.SaveChanges();
            }
        }

        public void Delete(int id)
        {
            p1p.Data.Team team;
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                team = ctx.Teams.Single(t => t.Id == id);
                ctx.Teams.Remove(team);
                ctx.SaveChanges();
            }
        }
    }
}
