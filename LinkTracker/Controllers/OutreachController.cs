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

    public class OutreachController : ApiController
    {
        static readonly OutreachRepository repo = new OutreachRepository();

        [Authorize(Roles="Manager,Employee,Admin")]
        [HttpGet]
        public List<OutreachDTO> GetAllForLink(int linkId)
        {
            return repo.GetAllOutreachForLink(linkId);
        }

        [Authorize(Roles="Manager,Employee,Admin")]
        [HttpGet]
        public List<OutreachDTO> Search(int linkId, int projectId, int typeId, int actionId, Nullable<DateTime> startDate, string endDate, bool onlyMine, int teamId)
        {
            Nullable<DateTime> modifiedEndDate = null;
            DateTime newEndDate;
            if (DateTime.TryParse(endDate, out newEndDate))
            {
                modifiedEndDate = newEndDate.AddDays(1);
            }
            string userName = Membership.GetUser().UserName;
            return repo.Search(linkId, projectId, typeId, actionId, startDate, modifiedEndDate, onlyMine, teamId, userName);
        }

        [Authorize(Roles="Manager,Employee,Admin")]
        [HttpGet]
        public int[] GetOutreachAggregateByDate(List<OutreachDTO> outreaches, Nullable<DateTime> startDate, Nullable<DateTime> endDate)
        {
            return repo.GetOutreachAggregateByDate(outreaches, startDate, endDate);
        }

        [Authorize(Roles="Manager,Employee,Admin")]
        [HttpPost]
        public void Add(OutreachDTO entry)
        {
            string user = Membership.GetUser().UserName;

            if (entry.OutreachType.Id == 1)
            {
                if(!string.IsNullOrEmpty(entry.EmailRecipient) || !string.IsNullOrEmpty(entry.EmailBody) || entry.PersonaId > 0)
                {
                    if(string.IsNullOrEmpty(entry.EmailRecipient) || string.IsNullOrEmpty(entry.EmailBody) || entry.PersonaId < 1)
                    {
                        throw new Exception("Recipient, Sender, and Email Content must all be populated before sending an email.");
                    }
                    else
                    {   
                        string attachmentPath = null;

                        if (entry.ArticleId > 0)
                        {
                            ArticleRepository articleRepo = new ArticleRepository();
                            ArticleDTO article = articleRepo.GetArticleById(entry.ArticleId);
                            DocumentUtility docUtil = new DocumentUtility();
                            attachmentPath = docUtil.ConvertHtmlToDocPath(new DocumentDTO() { Title = article.Title, Content = article.Content });
                        }

                        PersonaDTO persona = new PersonaRepository().GetById(entry.PersonaId);

                        string smtpServer = persona.SMTPServer;
                        int smtpPort = persona.SMTPPort;
                        string smtpUsername = persona.SMTPUsername;
                        string smtpPassword = persona.SMTPPassword;

                        if (persona.Email.ToLower().Contains("@gmail.com"))
                        {
                            smtpServer = "smtp.gmail.com";
                            smtpPort = 587;
                            smtpUsername = persona.GmailUsername;
                            smtpPassword = persona.GmailPassword;
                        }

                        MessagingHelper.SendEmail(persona.Email, entry.EmailRecipient, entry.EmailSubject, entry.EmailBody, attachmentPath, smtpServer, smtpPort, smtpUsername, smtpPassword);
                    }
                }
            }

            repo.AddOutreach(entry, user);
        }

        [Authorize(Roles="Manager,Employee,Admin")]
        [HttpPost]
        public OutreachDTO Update(OutreachDTO entry)
        {
            entry.AddedBy = this.User.Identity.Name;
            return repo.UpdateOutreach(entry);
        }

        [Authorize(Roles="Manager,Admin")]
        [HttpGet]
        public void Delete(int entryId)
        {
            repo.DeleteOutreach(entryId);
        }
    }
}
