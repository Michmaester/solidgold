using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPOS.Models
{
    public class Product
    {
        public string name { get; set; }
        public string description { get; set; }
        public Brand brand { get; set; }
        public Unit unit { get; set; }

        public string product_code { get; set; }
    }
}
