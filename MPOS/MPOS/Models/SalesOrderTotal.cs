using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPOS.Models
{
    public class SalesOrderTotal
    {

        public string order_no { get; set; }
        public string customer_id { get; set; }
        public string customer_name { get; set; }
        public int total_items { get; set; }
        public string discount_type { get; set; }
        public float discount { get; set; }
        public decimal total_discount { get; set; }
        public decimal total_amount_due { get; set; }
        public decimal total_amount_paid { get; set; }
        public decimal change_amount { get; set; }

    }
}
