using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPOS.Models
{
    public class PaymentsList
    {

        public string payment_type { get; set; }
        public decimal amount { get; set; }
        public decimal tendered { get; set; }

        public object details { get; set; }

    }
}
