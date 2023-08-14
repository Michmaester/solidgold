using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPOS.Models
{
    public class SalesTransactionItem
    {

        public int id { get; set; }
        public string sales_transaction_id { get; set; }
        public string qty { get; set; }
        public string delivery_qty { get; set; }
        public string product_id { get; set; }
        public string price_per_unit { get; set; }
        public string unit { get; set; }
        public string discounted_amount { get; set; }
        public string total_amount { get; set; }
        public Product product { get; set; }
        //public int stock_id { get; set; }
        //public int stock_batch_id { get; set; }
        //public int sales_stockout_id { get; set; }

        public string remarks { get; set; }

    }
}
