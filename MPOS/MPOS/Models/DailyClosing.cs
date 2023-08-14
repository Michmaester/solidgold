using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPOS.Models
{
    public class DailyClosing
    {
        public int id { get; set; }
        public string transaction_date { get; set; }
        public decimal? initial_cash_amount { get; set; }
        public string opening_datetime { get; set; }
        public string closing_datetime { get; set; }
        public decimal? total_sales_collection { get; set; }
        public decimal? total_net_accountability { get; set; }
        public decimal? short_over_amount { get; set; }

        public decimal? daily_total_expense { get; set; }

        public int? user_id { get; set; }
        public string branch_code { get; set; }
        public List<ClosingItem> closing_items { get; set; }

    }
}
