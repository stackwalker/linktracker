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
    
    public partial class EmployeeTeamXREF
    {
        public int Id { get; set; }
        public int TeamId { get; set; }
        public int EmployeeId { get; set; }
        public System.DateTime InsertDate { get; set; }
    
        public virtual Employee Employee { get; set; }
        public virtual Team Team { get; set; }
    }
}
