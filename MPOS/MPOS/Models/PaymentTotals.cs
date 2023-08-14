using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPOS.Models
{
    public class PaymentTotals
    {

        public decimal cash { get; set; }
        public decimal card { get; set; }
        public decimal cheque { get; set; }
        public decimal charges { get; set; }
        public decimal salesTotals { get; set; }

    }
}
