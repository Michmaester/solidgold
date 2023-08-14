using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPOS.Models
{
    public class PaymentCard
    {

        public int id { get; set; }
        public decimal amount { get; set; }
        public string card_no { get; set; }
        public DateTime expiration_date { get; set; }
        public string account_name { get; set; }
        public string confirmation_code { get; set; }
        public int bank_id { get; set; }

    }
}
