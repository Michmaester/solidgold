using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPOS.Models
{
    public class ClosingItem
    {
        public int id { get; set; }
        public string paytype { get; set; }
        public decimal bills { get; set; }
        public float cash_qty { get; set; }
        public decimal equiv { get; set; }

    }
}
