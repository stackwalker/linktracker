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
using WebMatrix.WebData;
using System.Net.Mail;

namespace p1p.Controllers
{
    
    public class EmployeeController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        static readonly EmployeeRepository repo = new EmployeeRepository();

        [Authorize(Roles="Manager,Employee,Admin")]
        [HttpGet]
        public List<EmployeeDTO> GetAll()
        {
            return repo.GetAll();
        }

        [Authorize(Roles="Manager,Employee,Admin")]
        [HttpGet]
        public EmployeeDTO Get(int id)
        {
            return repo.Get(id);
        }

        [Authorize(Roles="Manager,Employee,Admin")]
        [HttpGet]
        public EmployeeDTO GetByUser()
        {
            string User = Membership.GetUser().UserName;
            return repo.GetByUser(User);
        }

        [Authorize(Roles="Manager,Employee,Admin")]
        [HttpGet]
        public List<Types.DTO.EmployeeDetailDTO> GetAllEmployeesDetail()
        {
            return repo.GetAllEmployeesDetail();
        }

        [Authorize(Roles="Manager,Admin")]
        [HttpPost]
        public void Add(EmployeeDetailDTO item)
        {
            List<string> users = new List<string>();
            users = new SecurityHelper().GetAllUsernames();
            users = users.Where(u => u.Equals(item.Username)).ToList<string>();
            if (users.Count > 0)
            {
                throw new Exception("This username already exists.");
            }
            else
            {

                string password = Membership.GeneratePassword(12, 1);
                WebSecurity.CreateUserAndAccount(item.Username, password);

                MailMessage message = new MailMessage();
                message.From = new MailAddress("noreply@pageonepower.com");
                message.To.Add(new MailAddress(item.Email));
                message.Subject = "LinkTracker Account Created";
                message.Body = "" + password;

                SmtpClient client = new SmtpClient();
                client.Send(message);

                Roles.AddUserToRole(item.Username, "Employee");

                repo.Add(item);
            }
        }

        [Authorize(Roles="Manager,Employee,Admin")]
        [HttpPost]
        public void Update(EmployeeDetailDTO employee)
        {
            repo.Update(employee);
        }

        [Authorize(Roles="Manager,Admin")]
        [HttpPost]
        public void Delete(EmployeeDetailDTO employee)
        {
            foreach (string r in Roles.GetRolesForUser(employee.Username))
            {
                Roles.RemoveUserFromRole(employee.Username, r);
            }

            Membership.DeleteUser(employee.Username);

            repo.DeleteEmployee(employee);
        }
    }
}
