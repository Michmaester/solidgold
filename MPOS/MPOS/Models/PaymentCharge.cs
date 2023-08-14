using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPOS.Models
{
    public class PaymentCharge
    {

        public int id { get; set; }
        public decimal amount { get; set; }
        public DateTime charge_date { get; set; }
        public string customer_id { get; set; }

    }
}
