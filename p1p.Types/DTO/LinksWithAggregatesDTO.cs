using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace p1p.Types.DTO
{
    public class LinksWithAggregatesDTO
    {
        public List<LinkDTO> Links { get; set; }
        public List<AggregateDTO> Aggregates { get; set; }
    }
}
