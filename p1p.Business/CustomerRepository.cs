using System;
using System.Collections.Generic;
using System.Linq;
using p1p.Types.DTO;
using p1p.Data;

namespace p1p.Business
{
    public class CustomerRepository
    {        
        public List<CustomerDTO> GetAll()
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return (from c in ctx.Customers orderby c.BusinessName select c)
                    .AsEnumerable()
                    .Select(c => (CustomerDTO)P1PObjectMapper.Convert(c, typeof(CustomerDTO))).ToList<CustomerDTO>();
            }

        }

        public CustomerDTO Get(int id)
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return (CustomerDTO)P1PObjectMapper.Convert(ctx.Customers.Single(a => a.Id == id), typeof(CustomerDTO));
            }
        }

        public CustomerDTO GetByUser(string user)
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return (CustomerDTO)P1PObjectMapper.Convert(ctx.Customers.Single(c => c.Username.Equals(user)), typeof(CustomerDTO));
            }
        }

        public CustomerDTO GetCustomerByUser(string user)
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return (CustomerDTO)P1PObjectMapper.Convert(ctx.Customers.Single(c => c.Username.Equals(user)), typeof(CustomerDTO));
            }
        }

        public List<CustomerDTO> SearchCustomers()
        {
            using (p1p.Data.P1PContext ctx = new Data.P1PContext())
            {
                return (from c in ctx.Customers select c)
                    .AsEnumerable()
                    .Select(c => (CustomerDTO)P1PObjectMapper.Convert(c, typeof(CustomerDTO))).ToList<CustomerDTO>();
            }
        }

        public bool IsDuplicate(string businessName)
        {
            bool isDuplicate = true;
            p1p.Data.Customer mdlCustomer;
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                mdlCustomer = ctx.Customers.FirstOrDefault(c => c.BusinessName.Equals(businessName));
            }
            if (mdlCustomer == null)
            {
                isDuplicate = false;
            }
            return isDuplicate;
        }

        public bool IsEmailRegistered(string emailAddress)
        {
            using (p1p.Data.P1PContext ctx = new Data.P1PContext())
            {                
                return (ctx.Customers.Where(c => c.Email.Equals(emailAddress)).Count() > 0);
            }
        }

        public string GetUsernameByEmail(string email)
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                return ctx.Customers.Single(e => e.Email.Equals(email)).Username;
            }
        }
        public void Add(CustomerDTO item)
        {
            p1p.Data.Customer mdlCustomer = (p1p.Data.Customer)P1PObjectMapper.Convert(item, typeof(p1p.Data.Customer));
            mdlCustomer.InsertDate = DateTime.Now;
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                ctx.Customers.Add(mdlCustomer);
                ctx.SaveChanges();
            }
        }

        public void Update(CustomerDTO item)
        {
            p1p.Data.Customer mdlCustomer = (p1p.Data.Customer)P1PObjectMapper.Convert(item, typeof(p1p.Data.Customer));
            p1p.Data.Customer match;
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                match = ctx.Customers.Single(c => c.Id == item.Id);
                ctx.Entry(match).CurrentValues.SetValues(item);
                ctx.SaveChanges();
            }
        }

        public void UpdateProfile(CustomerDTO customer)
        {
            Customer cust = (Customer)P1PObjectMapper.Convert(customer, typeof(Customer));

            using (P1PContext ctx = new P1PContext())
            {
                Customer match = ctx.Customers.Single(c => c.Username.Equals(cust.Username));
                ctx.Entry(match).CurrentValues.SetValues(cust);
                ctx.SaveChanges();
            }
        }

        public void Delete(int id)
        {
            using (p1p.Data.P1PContext ctx = new p1p.Data.P1PContext())
            {
                var toRm = ctx.Customers.Single(a => a.Id == id);
                try
                {
                    ctx.Customers.Remove(toRm);
                    ctx.SaveChanges();
                }
                catch (System.Data.Entity.Infrastructure.DbUpdateException ex)
                {
                    if ("The DELETE statement conflicted with the REFERENCE constraint \"FK_dbo.Projects_dbo.Customers_CustomerId\". The conflict occurred in database \"p1pLinkTracker\", table \"dbo.Projects\", column 'CustomerId'.\r\nThe statement has been terminated.".Equals(ex.InnerException.InnerException.Message))
                    {
                        throw new Exception("You can't delete an account that has projects assigned to it.");
                    }
                    else
                    {
                        throw new Exception("The account cannot be deleted.");
                    }
                }
            }
        }
    }
}