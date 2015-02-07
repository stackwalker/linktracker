using System;

namespace p1p.Types.DTO
{
    public class CustomerDTO
    {
        public int Id { get; set; }
        public string BusinessName { get; set; }
        public string StreetAddress { get; set; }
        public string Phone { get; set; }
        public string WebsiteURL { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public DateTime InsertDate { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
    }
}
