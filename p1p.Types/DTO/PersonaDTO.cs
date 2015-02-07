using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace p1p.Types.DTO
{
    public class PersonaDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public Nullable<DateTime> DateOfBirth  { get; set; }
        public string Experience { get; set; }
        public string ConnectionToCustomer { get; set; }
        public string Bio { get; set; }
        public string Notes { get; set; }
        public string GmailUsername { get; set; }
        public string GmailPassword { get; set; }
        public string DomainUsername { get; set; }
        public string DomainPassword { get; set; }
        public string SMTPServer { get; set; }
        public string SMTPUsername { get; set; }
        public string SMTPPassword { get; set; }
        public int SMTPPort { get; set; }        
    }
}
