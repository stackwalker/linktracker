using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace p1p.Types.DTO
{
    public class SocialAccountDetailDTO : SocialAccountDTO
    {
        public int ProjectId { get; set; }
        public int PersonaId { get; set; }
    }
}
