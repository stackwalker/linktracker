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
    
    public partial class ProjectPersonaXREF
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public int PersonaId { get; set; }
        public System.DateTime InsertDate { get; set; }
    
        public virtual Project Project { get; set; }
        public virtual Persona Persona { get; set; }
    }
}
