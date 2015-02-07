using System;

namespace p1p.Types.DTO
{
    public class TimeEntryDTO
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string UserId { get; set; }
        public Nullable<DateTime> StartTime { get; set; }
        public Nullable<DateTime> EndTime { get; set; }
        public TimeSpan Elapsed { get; set; }
        public string Activity { get; set; }
        public string Note { get; set; }
        public bool IsTimeOff { get; set; }
        public DateTime InsertDate { get; set; }
        public ProjectDTO Project { get; set; }
    }
}
