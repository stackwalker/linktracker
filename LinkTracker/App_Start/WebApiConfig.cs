using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace p1p
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            /*           config.Routes.MapHttpRoute(
                            name: "DefaultApi",
                            routeTemplate: "api/{controller}/{id}",
                            defaults: new { id = RouteParameter.Optional }
                        );*/

            config.Routes.MapHttpRoute(
                name: "DefaultWithAction",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional });

            var json = config.Formatters.JsonFormatter;
            json.SerializerSettings.PreserveReferencesHandling =
                Newtonsoft.Json.PreserveReferencesHandling.Objects;

            config.Formatters.Remove(config.Formatters.XmlFormatter);

            config.Filters.Add(new p1p.Filters.GenericExceptionFilter());
        }
    }
}