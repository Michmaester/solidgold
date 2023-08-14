using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPOS.Models
{
   
    public class ResultTransactions
    {
        public List<SalesTransaction> data { get; set; }
        public PaymentTotals payments_totals { get; set; }
    }
}
