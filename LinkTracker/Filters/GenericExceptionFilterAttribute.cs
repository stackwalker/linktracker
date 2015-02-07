using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Filters;
using System.Web.Http;
using System.Net.Http;
using System.Net;
using log4net;

namespace p1p.Filters
{
    public class GenericExceptionFilter : ExceptionFilterAttribute
    {
        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {
            log.Error(actionExecutedContext.Exception.Message, actionExecutedContext.Exception);

            throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent(actionExecutedContext.Exception.Message),
                    ReasonPhrase = actionExecutedContext.Exception.Message
                });
            //base.OnException(actionExecutedContext);
        }
    }
}