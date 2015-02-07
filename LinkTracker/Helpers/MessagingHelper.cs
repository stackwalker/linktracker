using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.Mail;
using System.Net;

namespace p1p
{
    public class MessagingHelper
    {
        public static void SendEmail(string from, string to, string subject, string body, string attachmentPath, string smtpServer, int smtpPort, string smtpUsername, string smtpPassword)
        {
            MailMessage msg = new MailMessage(from, to, subject, body);
            //TODO should pull this from config but I'm currently lazy
                        
            if (!string.IsNullOrEmpty(attachmentPath))
            {
                Attachment attachment = new Attachment(attachmentPath);
                msg.Attachments.Add(attachment);
            }

            msg.IsBodyHtml = true;

            //Assumes we won't be sending to an anonymous STMP server
            if (string.IsNullOrEmpty(smtpServer) || smtpPort < 1 || string.IsNullOrEmpty(smtpUsername) || string.IsNullOrEmpty(smtpPassword))
            {
                throw new Exception("Missing STMP Server information.  Check that the server name, port, smtp username and smtp password are all populated in the persona.");
            }
            
            //This hard codes the SMTP server to PageOne's if none is specified.. which we don't want to do right now.
            //smtpServer = string.IsNullOrEmpty(smtpServer) ? "mail.pageonepower.com" : smtpServer;
            //smtpUsername = string.IsNullOrEmpty(smtpUsername) ? "noreply@pageonepower.com" : smtpUsername;
            //smtpPassword = string.IsNullOrEmpty(smtpPassword) ? "ihateamerica" : smtpPassword;
            //smtpPort = smtpPort < 1 ? 25 : smtpPort;

            SmtpClient client = new SmtpClient(smtpServer, smtpPort);
            try
            {
                client.EnableSsl = smtpPort == 465 || smtpPort == 587;
                //client.Port = smtpPort;
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential(smtpUsername, smtpPassword);
                System.Net.ServicePointManager.ServerCertificateValidationCallback += delegate { return true; };
                client.Send(msg);
            }            
            finally
            {
                msg.Dispose();
                client.Dispose();

                if (!string.IsNullOrEmpty(attachmentPath))
                {
                    System.IO.File.Delete(attachmentPath);
                }
            }            
        }
    }
}
