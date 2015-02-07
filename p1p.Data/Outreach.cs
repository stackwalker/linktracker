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
    
    public partial class Outreach
    {
        public int Id { get; set; }
        public int LinkId { get; set; }
        public int OutreachActionId { get; set; }
        public int OutreachTypeId { get; set; }
        public string OutreachNotes { get; set; }
        public string AddedBy { get; set; }
        public Nullable<System.DateTime> DateOutreached { get; set; }
        public System.DateTime InsertDate { get; set; }
        public string EmailRecipient { get; set; }
        public string EmailBody { get; set; }
        public Nullable<int> PersonaId { get; set; }
        public Nullable<int> ArticleId { get; set; }
    
        public virtual Article Article { get; set; }
        public virtual Link Link { get; set; }
        public virtual OutreachAction OutreachAction { get; set; }
        public virtual OutreachType OutreachType { get; set; }
        public virtual Persona Persona { get; set; }
    }
}