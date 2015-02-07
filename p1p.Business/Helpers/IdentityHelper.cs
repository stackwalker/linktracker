using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using p1p.Data;

namespace p1p.Business
{
    public static class IdentityHelper
    {
        public static string GetUserIdByName(string fullName)
        {
            string[] firstLast = fullName.Split(' ');
            return GetUserIdByName(firstLast[0], firstLast[1]);
        }

        public static string StripDomainFromUser(string qualified)
        {
            int userNameStart = qualified.IndexOf("\\") + 1;
            int length = qualified.Length - userNameStart;
            return qualified.Substring(userNameStart, length);
        }

        public static string GetUserIdByName(string firstName, string lastName)
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return ctx.Employees.Single(e => e.FirstName.Equals(firstName, StringComparison.OrdinalIgnoreCase) && e.LastName.Equals(lastName, StringComparison.OrdinalIgnoreCase)).Username;
            }
        }
    }
}