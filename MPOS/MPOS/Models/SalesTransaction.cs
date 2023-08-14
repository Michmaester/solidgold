using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPOS.Models
{
    public class SalesTransaction
    {

        public int id { get; set; }
        public DateTime transaction_date { get; set; }
        public string customer_id { get; set; }
        public string transaction_type { get; set; }
        public decimal total_amount_due { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Include)]
        public decimal? deduct_1perc_amount { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Include)]
        public decimal? total_amount_due_without_deduct_1perc { get; set; }
        public string invoice_no { get; set; }
        public string invoice_type { get; set; }
        public decimal total_amount_tendered { get; set; }
        public decimal balance_amount { get; set; }
        public decimal change_amount { get; set; }
        public decimal total_discounted_amount { get; set; }
        public string Or_no { get; set; }
        public string status { get; set; }
        public string payment_status { get; set; }
        public string payment_duedate { get; set; }
        public string payment_terms { get; set; }
        public int user_id { get; set; }
        public int salesfront_user_id { get; set; }
        public string branch_code { get; set; }
        public string invoice_print_type { get; set; }
        public string cash_remark { get; set; }

        public Customer customer { get; set; }
        public User salesfront { get; set; }
        public SalesDelivery delivery { get; set; }
        public List<SalesTransactionItem> trans_items { get; set; }

    }
}
