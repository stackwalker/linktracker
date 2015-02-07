using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace p1p.Types.DTO
{
    public class EmployeeDashboardReportDTO
    {
        public List<AggregateDTO> NeedsAttentionProjectAggregates { get; set; }
        public int[] NeedsAttentionWeeksAggregates { get; set; }
        public List<AggregateDTO> ScheduledLinkAggregates { get; set; }
        public List<AggregateDTO> OutreachLinkAggregates { get; set; }
        public List<AggregateDTO> InCommunicationLinkAggregates { get; set; }
        public List<AggregateDTO> LinksToActivateAggregates { get; set; }
        public List<AggregateDTO> SendToLeadershipLinkAggregates { get; set; }
        public List<AggregateDTO> AcquiredLinkAggregates { get; set; }
        public List<AggregateDTO> TimeEntryProjectAggregates { get; set; }
        public List<AggregateDTO> TimeEntryActivityAggregates { get; set; }
        public int[] OutreachAggregatesByDate { get; set; }
        public int[] InCommunicationLinkAggregatesByDate { get; set; }
        public List<ArticleDTO> Articles { get; set; }
        public List<DateTime> Weeks { get; set; }
        public List<AggregateDTO> NeedsOutreachLinkAggregates { get; set; }
    }
}
