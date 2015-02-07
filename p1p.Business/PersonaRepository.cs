using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using p1p.Types.DTO;

namespace p1p.Business
{
    public class PersonaRepository
    {
        public PersonaDTO GetById(int Id)
        {
            using(p1p.Data.P1PContext ctx = new Data.P1PContext())
            {                
                return (PersonaDTO)P1PObjectMapper.Convert(ctx.Personas.Single(p => p.Id == Id), typeof(PersonaDTO));
            }
        }
    }
}
