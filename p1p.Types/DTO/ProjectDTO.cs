using System;
using System.Collections.Generic;

namespace p1p.Types.DTO
{
    public class ProjectDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int CustomerId { get; set; }
        public CustomerDTO Customer { get; set; }
        public bool IsActive { get; set; }
        public TeamDTO Team { get; set; }
        public KeyValueDTO BillingCycle { get; set; }
        public System.DateTime DateCreated { get; set; }
        public DateTime InsertDate { get; set; }
        public string Strategy { get; set; }
        public string SpecialRequirements { get; set; }
        public string BigWin { get; set; }
        public List<KeyValueDTO> Categories { get; set; }
    }
}
