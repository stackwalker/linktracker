using System;
using System.Collections.Generic;
using System.Linq;
using p1p.Data;
using p1p.Types.DTO;

namespace p1p.Business
{
    public class EmployeeRepository
    {
        public List<EmployeeDTO> GetAll()
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return (from e in ctx.Employees select e)
                    .AsEnumerable()
                    .Select(e => (EmployeeDTO)P1PObjectMapper.Convert(e, typeof(EmployeeDTO))).ToList<EmployeeDTO>();
            }
        }

        public EmployeeDTO Get(int id)
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return (EmployeeDTO)P1PObjectMapper.Convert(ctx.Employees.Single(a => a.Id == id), typeof(EmployeeDTO));
            }

        }

        public EmployeeDTO GetByUser(string User)
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return (EmployeeDTO)P1PObjectMapper.Convert(ctx.Employees.Single(e => e.Username.Equals(User)), typeof(EmployeeDTO));
            }
        }

        public bool IsEmailRegistered(string emailAddress)
        {
            using (p1p.Data.P1PContext ctx = new Data.P1PContext())
            {
                return (ctx.Employees.Where(c => c.Email.Equals(emailAddress)).Count() > 0);
            }
        }

        public string GetUsernameByEmail(string email)
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return ctx.Employees.Single(e => e.Email.Equals(email)).Username;
            }
        }

        public List<Types.DTO.EmployeeDetailDTO> GetAllEmployeesDetail()
        {
            List<EmployeeDetailDTO> details;
            
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                details = (from e in ctx.Employees                    
                    select new EmployeeDetailDTO()
                    {
                        Id = e.Id,
                        FirstName = e.FirstName,
                        LastName = e.LastName,
                        Email = e.Email,
                        InsertDate = e.InsertDate,
                        Username = e.Username,                        
                    }).ToList<EmployeeDetailDTO>();

                foreach (EmployeeDetailDTO ed in details)
                {
                    TeamDTO mdlTeam;
                    mdlTeam = (from utx in ctx.EmployeeTeamXREFs
                               where utx.EmployeeId == ed.Id
                               select new TeamDTO() { Id = utx.Team.Id, Name = utx.Team.Name, InsertDate = utx.Team.InsertDate }).FirstOrDefault();
                    if (mdlTeam != null)
                    {
                        ed.Team = new TeamDTO();
                        ed.Team.Id = mdlTeam.Id;
                        ed.Team.Name = mdlTeam.Name;
                        ed.Team.InsertDate = mdlTeam.InsertDate;
                    }
                }
            }

            return details;
        }

        public void Add(EmployeeDetailDTO item)
        {
            p1p.Data.Employee mdlEmployee = (p1p.Data.Employee)P1PObjectMapper.Convert(item, typeof(p1p.Data.Employee));
            mdlEmployee.InsertDate = DateTime.Now;
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                if (item.Team.Id != 0)
                {
                    ctx.EmployeeTeamXREFs.Add(new EmployeeTeamXREF()
                    {
                        EmployeeId = item.Id,
                        TeamId = item.Team.Id,
                        InsertDate = DateTime.Now
                    });
                }
                ctx.Employees.Add(mdlEmployee);
                ctx.SaveChanges();
            }
        }

        public void Update(EmployeeDetailDTO item)
        {
            p1p.Data.Employee mdlEmployee = (p1p.Data.Employee)P1PObjectMapper.Convert(item, typeof(p1p.Data.Employee));
            p1p.Data.Employee match;
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                if (item.Team != null && item.Team.Id != 0)
                {
                    EmployeeTeamXREF xref = ctx.EmployeeTeamXREFs.FirstOrDefault(x => x.EmployeeId == item.Id);
                    if (xref != null)
                    {
                        if (xref.TeamId != item.Team.Id)
                        {
                            ctx.EmployeeTeamXREFs.Remove(xref);
                            ctx.EmployeeTeamXREFs.Add(new EmployeeTeamXREF()
                            {
                                EmployeeId = item.Id,
                                TeamId = item.Team.Id,
                                InsertDate = DateTime.Now
                            });
                            ctx.SaveChanges();
                        }
                    }
                    else
                    {
                        ctx.EmployeeTeamXREFs.Add(new EmployeeTeamXREF()
                        {
                            EmployeeId = item.Id,
                            TeamId = item.Team.Id,
                            InsertDate = DateTime.Now
                        });
                        ctx.SaveChanges();
                    }
                }
                match = ctx.Employees.Single(c => item.Id == c.Id);
                ctx.Entry(match).CurrentValues.SetValues(mdlEmployee);
                ctx.SaveChanges();
            }
        }

        public void DeleteEmployee(EmployeeDetailDTO employee)
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                var employeeToRm = ctx.Employees.Single(a => a.Id == employee.Id);
                ctx.Employees.Remove(employeeToRm);

                var teamXrfs = ctx.EmployeeTeamXREFs.Where(x => x.EmployeeId == employee.Id);
                foreach (var x in teamXrfs)
                {
                    ctx.EmployeeTeamXREFs.Remove(x);
                }

                var projXrfs = ctx.OrderEmployeeXREFs.Where(x => x.EmployeeId == employee.Id);
                foreach (var x in projXrfs)
                {
                    ctx.OrderEmployeeXREFs.Remove(x);
                }

                ctx.SaveChanges();
            }
        }
    }
}