using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPOS.Models
{
    public class Invoice
    {
        public int id { get; set; }

        public string transaction_date { get; set; }
        public string transaction_type { get; set; }
        public string invoice_no { get; set; }
        public string customer { get; set; }
        public string total_amount_due { get; set; }
        public string total_amount_tendered { get; set; }
        public string balance_amount { get; set; }
        public string change_amount { get; set; }
        public string total_discounted_amount { get; set; }
        public string status { get; set; }
        public string payment_status { get; set; }
        public string branch_code { get; set; }

        public string salesman { get; set; }

        public string delivery_requested_date { get; set; }
        public string delivery_fee { get; set; }
        public string delivery_notes { get; set; }
    }
}
