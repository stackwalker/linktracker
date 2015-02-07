using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebMatrix.WebData;

namespace p1p
{
    public class WebSecurityInitializer
    {
        private static WebSecurityInitializer _instance;

        public static WebSecurityInitializer Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new WebSecurityInitializer();
                }
                return _instance;
            }
        }
        private bool isInitialized = false;
        
        private readonly object SyncRoot = new object();

        public void EnsureInitialize()
        {
            lock (this.SyncRoot)
            {
                if (!isInitialized)
                {
                    isInitialized = true;
                    WebSecurity.InitializeDatabaseConnection("p1pmembership", "UserProfile", "UserId", "UserName", autoCreateTables: true);
                }
            }
        }
    }
}