using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPOS.Models
{
    public class PaymentCheque
    {

        public int id { get; set; }
        public decimal amount { get; set; }
        public string cheque_name { get; set; }
        public string cheque_no { get; set; }
        public DateTime cheque_date { get; set; }
        public string type { get; set; }
        public int bank_id { get; set; }

    }
}
