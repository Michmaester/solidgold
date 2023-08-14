using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPOS.Models
{
    public class Branch
    {
        public int id { get; set; }
        public string branch_code { get; set; }
        public string name { get; set; }
        public string address { get; set; }
    }
}
