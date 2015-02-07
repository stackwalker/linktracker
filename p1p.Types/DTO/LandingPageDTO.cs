using System;

namespace p1p.Types.DTO
{
    public class LandingPageDTO
    {
        public int Id { get; set; }
        public string LandingPageUrl { get; set; }
        public string AnchorText { get; set; }
        public int ProjectId { get; set; }
        public int Priority { get; set; }
        public DateTime InsertDate { get; set; }
    }
}
