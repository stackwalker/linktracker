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
    
    public partial class Keyword
    {
        public Keyword()
        {
            this.LandingPageKeywordXREFs = new HashSet<LandingPageKeywordXREF>();
            this.ProjectKeywordXREFs = new HashSet<ProjectKeywordXREF>();
        }
    
        public int Id { get; set; }
        public string Text { get; set; }
        public System.DateTime InsertDate { get; set; }
    
        public virtual ICollection<LandingPageKeywordXREF> LandingPageKeywordXREFs { get; set; }
        public virtual ICollection<ProjectKeywordXREF> ProjectKeywordXREFs { get; set; }
    }
}