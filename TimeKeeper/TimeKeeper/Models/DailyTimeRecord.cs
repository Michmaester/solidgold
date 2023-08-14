using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MecsTimeKeeper.Models
{
    public class DailyTimeRecord
    {

        public int id { get; set; }
        public string dtr_id { get; set; }
        public int emp_id { get; set; }
        public string dtr_datetime { get; set; }
        public string branch_code { get; set; }
        public int sync_flag { get; set; }

    }
}
