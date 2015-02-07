using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace p1p.Types.DTO
{
    public class EmployeeDetailDTO : EmployeeDTO
    {
        public TeamDTO Team { get; set; }
    }
}
    