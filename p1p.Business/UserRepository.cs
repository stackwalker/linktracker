using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace p1p.Business
{
    public class UserRepository
    {
        public bool IsEmailRegistered(string emailAddress)
        {
            using (p1p.Data.P1PContext ctx = new Data.P1PContext())
            {
                return ctx.Employees.Where(e => e.Email.Equals(emailAddress)).Count() > 0 ||
                    ctx.Customers.Where(c => c.Email.Equals(emailAddress)).Count() > 0;
            }
        }

        public string GetUsernameByEmail(string emailAddress)
        {
            using (p1p.Data.P1PContext ctx = new Data.P1PContext())
            {
                string userName = null;
                
                p1p.Data.Customer c = ctx.Customers.FirstOrDefault(cst => cst.Email.Equals(emailAddress));
                p1p.Data.Employee e = ctx.Employees.FirstOrDefault(emp => emp.Email.Equals(emailAddress));
                
                if(c != null){
                    userName = c.Username;
                }
                else if(e != null){
                    userName = e.Username;
                }
                
                return userName;
            }
        }
    }
}
