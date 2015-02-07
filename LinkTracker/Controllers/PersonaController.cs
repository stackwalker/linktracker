using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using p1p.Types.DTO;
using p1p.Business;
namespace p1p.Controllers
{
    public class PersonaController : ApiController
    {
        [HttpGet]
        public PersonaDTO Get(int Id)
        {
            return new PersonaRepository().GetById(Id);
        }
    }
}
