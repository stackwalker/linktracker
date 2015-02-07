using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Security;
using Microsoft.Web.WebPages.OAuth;
using WebMatrix.WebData;

namespace p1p
{
    public static class AuthConfig
    {
        public static void RegisterAuth()
        {
            // To let users of this site log in using their accounts from other sites such as Microsoft, Facebook, and Twitter,
            // you must update this site. For more information visit http://go.microsoft.com/fwlink/?LinkID=252166

            //OAuthWebSecurity.RegisterMicrosoftClient(
            //    clientId: "",
            //    clientSecret: "");

            //OAuthWebSecurity.RegisterTwitterClient(
            //    consumerKey: "",
            //    consumerSecret: "");

            //OAuthWebSecurity.RegisterFacebookClient(
            //    appId: "",
            //    appSecret: "");

            //OAuthWebSecurity.RegisterGoogleClient();
            WebSecurity.InitializeDatabaseConnection("p1pmembership", "UserProfile", "UserId", "UserName", autoCreateTables: true);

            //TODO Not sure if this is the best way to seed


            if (!WebSecurity.UserExists("admin"))
            {
                if (!Roles.RoleExists("Admin"))
                {
                    Roles.CreateRole("Admin");
                }

                if (!Roles.RoleExists("Employee"))
                {
                    Roles.CreateRole("Employee");
                }

                if (!Roles.RoleExists("Client"))
                {
                    Roles.CreateRole("Client");
                }

                WebSecurity.CreateUserAndAccount("admin", "p1pRoot");
                Roles.AddUserToRole("admin", "Admin");
                Roles.AddUserToRole("admin", "Employee");
            }
            //p1p.WebSecurityInitializer.Instance.EnsureInitialize();
        }
    }
}
