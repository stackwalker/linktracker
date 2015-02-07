using System;
using System.Collections.Generic;

namespace p1p.Types.DTO
{
    public class ClientReportDTO
    {
        public List<LinkDTO> PeriodLinks { get; set; }
        public List<TimeEntryDTO> PeriodHours { get; set; }
        public List<OutreachDTO> PeriodOutreach { get; set; }
        public List<Types.DataPoint> AggregateHoursByActivity { get; set; }
        public List<Types.DataPoint> AggregateOutreach { get; set; }
        public List<Types.DataPoint> AggregateLinksByType { get; set; }
        public List<Types.DataPoint> AggregateAnchorText { get; set; }
        public double TotalHours { get; set; }
        public double HoursPerLink { get; set; }
        public int TotalOutreachCount { get; set; }
        public int LinksInCommunicationCount { get; set; }
        public int SitesTargetedCount { get; set; }
        public int ScheduledCount { get; set; }
        public int LinksPendingCount { get; set; }
        public int TotalLinkCount { get; set; }
        public double AverageDomainAuthority { get; set; }
        public int UniqueDomainCount { get; set; }
    }
}