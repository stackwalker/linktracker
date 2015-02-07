using System;

namespace p1p.Types.DTO
{
    public class EmployeeDTO
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public DateTime InsertDate { get; set; }
        public string LastName { get; set; }
    }
}
