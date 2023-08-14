using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPOS.Models
{
    public class SalesDelivery
    {
        public string dr_no { get; set; }
        public string invoice_no { get; set; }
        public string delivery_requested_date { get; set; }
        public string delivery_notes { get; set; }
        public string delivery_fee { get; set; }
        public string status { get; set; }
     
        public string delivered_date { get; set; }
        public string branch_code { get; set; }
    }
}
