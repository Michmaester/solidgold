using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPOS.Models
{
    public class SalesOrder
    {
        public int id { get; set; }
        public string order_no { get; set; }
        public DateTime order_date { get; set; }
        public string customer_id { get; set; }
        public string customer_name { get; set; }
        public string customer_address { get; set; }
        public string sales_type { get; set; }
        public List<SalesOrderItem> order_items { get; set; }
        public string status { get; set; }
        public string shipment { get; set; }
        public string delivery_request_date { get; set; }
        public decimal delivery_fee { get; set; }
        public string delivery_notes { get; set; }
        public string branch_code { get; set; }
        public int user_id { get; set; }

        public string cash_remark { get; set; }

    }
}
