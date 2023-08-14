using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPOS.Models
{
    public class InvoiceItem
    {
        public int id { get; set; }
      
        public int qty { get; set; }
        public string delivery_qty { get; set; }
        public string product_id { get; set; }
        public string price_per_unit { get; set; }
        public string unit { get; set; }
        public string discounted_amount { get; set; }
        public string total_amount { get; set; }



        public string product_code { get; set; }
        public string product_name { get; set; }
        public string product_description { get; set; }
        public string brand { get; set; }
        public string item_unit { get; set; }
        
    }
}
