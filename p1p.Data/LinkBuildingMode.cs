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
    
    public partial class LinkBuildingMode
    {
        public LinkBuildingMode()
        {
            this.Links = new HashSet<Link>();
        }
    
        public int Id { get; set; }
        public string Name { get; set; }
    
        public virtual ICollection<Link> Links { get; set; }
    }
}
