using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPOS.Models
{
    public class Customer
    {
        public string customer_id { get; set; }
        public string name { get; set; }
        public string contact_person { get; set; }
        public string address { get; set; }
        public string mobile1 { get; set; }
        public string mobile2 { get; set; }
        public string landline { get; set; }
        public string email { get; set; }
        public string fax { get; set; }

    }
}
