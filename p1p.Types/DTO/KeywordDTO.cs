using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace p1p.Types.DTO
{
    public class KeywordDTO
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public int ProjectPriority { get; set;}
        public int LandingPagePriority { get; set; }
        public int LandingPageId { get; set; }
    }
}
