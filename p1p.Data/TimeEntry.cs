//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace p1p.Data
{
    using System;
    using System.Collections.Generic;
    
    public partial class TimeEntry
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string UserId { get; set; }
        public Nullable<System.DateTime> StartTime { get; set; }
        public Nullable<System.DateTime> EndTime { get; set; }
        public System.TimeSpan Elapsed { get; set; }
        public string Activity { get; set; }
        public string Note { get; set; }
        public bool IsTimeOff { get; set; }
        public System.DateTime InsertDate { get; set; }
    
        public virtual Project Project { get; set; }
    }
}
