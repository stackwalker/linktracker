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
    public class CustomerController : ApiController
    {
        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        static readonly CustomerRepository repo = new CustomerRepository();

        [HttpGet]
        [Authorize(Roles="Manager,Admin, Employee")]
        public List<CustomerDTO> GetAll()
        {

            return repo.GetAll();

        }

        [HttpGet]
        [Authorize(Roles="Manager,Admin,Employee")]
        public CustomerDTO Get(int id)
        {

            return repo.Get(id);

        }

        [HttpGet]
        [Authorize(Roles="Client")]
        public CustomerDTO GetByUser()
        {
            string User = Membership.GetUser().UserName;

            return repo.GetByUser(User);

        }

        [Authorize(Roles="Manager,Admin,Employee")]
        [HttpGet]
        public List<CustomerDTO> Search()
        {
            CustomerRepository repo = new CustomerRepository();
            return repo.SearchCustomers();
        }

        [Authorize(Roles="Manager,Admin")]
        [HttpPost]
        public void Add(CustomerDTO item)
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
               
                Roles.AddUserToRole(item.Username, "Client");

                repo.Add(item);

                MailMessage message = new MailMessage();
                message.From = new MailAddress("noreply@pageonepower.com");
                message.To.Add(new MailAddress(item.Email));
                message.Subject = "LinkTracker Account Created";
                message.Body = "Thank you for choosing Page One Power."
                + "  We are excited to be partnering with you and your project."
                + "  At Page One Power we strive for transparency in everything we do."
                + "  To that end we have developed Link Tracker."
                + "  Your one stop destination to see all the work being done on your account."
                + "  Log in, click around, see your links, and track the progress we are making month over month."
                + "  Thank you again for your business and we will be talking to you soon.\n"
                + "  Page One Power.\n"
                + "  Your Temporary Password is: " + password;

                SmtpClient client = new SmtpClient();
                try
                {
                    client.Send(message);
                }
                catch (Exception ex)
                {
                    log.Error("Email to customer failed.  Username: " + item.Username + " Password: " + password);
                    throw ex;
                }
            }
        }

        [Authorize(Roles="Manager,Admin, Client")]
        [HttpPost]
        public void Update(CustomerDTO item)
        {
            repo.Update(item);
        }

        [Authorize(Roles="Manager,Admin")]
        [HttpGet]
        public void Delete(int id)
        {
            repo.Delete(id);
        }

        [Authorize(Roles="Manager,Admin")]
        [HttpGet]
        public bool IsDuplicate(string accountName)
        {
            return repo.IsDuplicate(accountName);
        }
    }
}
