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
    
    public partial class LandingPage
    {
        public LandingPage()
        {
            this.LandingPageKeywordXREFs = new HashSet<LandingPageKeywordXREF>();
            this.ProjectLandingPageXREFs = new HashSet<ProjectLandingPageXREF>();
        }
    
        public int Id { get; set; }
        public string LandingPageUrl { get; set; }
        public System.DateTime InsertDate { get; set; }
    
        public virtual ICollection<LandingPageKeywordXREF> LandingPageKeywordXREFs { get; set; }
        public virtual ICollection<ProjectLandingPageXREF> ProjectLandingPageXREFs { get; set; }
    }
}
