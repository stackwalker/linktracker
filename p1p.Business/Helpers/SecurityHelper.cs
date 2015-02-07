using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using p1p.Data;

namespace p1p.Business
{
    public class SecurityHelper
    {
        public List<string> GetAllUsernames()
        {
            using (SecurityContext ctx = new SecurityContext()) 
            {             
                return (from u in ctx.UserProfiles select u.UserName).ToList<string>();
            }
        }

        public List<Types.DTO.RoleDTO> GetAllRoles()
        {
            using (SecurityContext ctx = new SecurityContext())
            {
                return (from r in ctx.webpages_Roles select new Types.DTO.RoleDTO() { Id = r.RoleId, Name = r.RoleName }).ToList<Types.DTO.RoleDTO>();
            }
        }
    }
}