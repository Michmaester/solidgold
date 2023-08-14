using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MecsTimeKeeper.Models
{
    public class Finger
    {
        public int id { get; set; }
        public int emp_id { get; set; }
        public byte[] finger_template { get; set; }
    }
}
