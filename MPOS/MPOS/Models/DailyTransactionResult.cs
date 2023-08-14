using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPOS.Models
{
    public class DailyTransactionResult
    {
        public string status { get; set; }
        public DailyClosing data { get; set; }
    }
}
