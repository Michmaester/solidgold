using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPOS.Models
{
    public class SalesOrderItem
    {
        public int id { get; set; }
        public string order_no { get; set; }
        public string product_id { get; set; }
        public decimal sale_price { get; set; }
        public int quantity { get; set; }
        public Product product { get; set; }

        public string remarks { get; set; }
    }
}
