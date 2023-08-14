using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPOS.Models
{
    public class User
    {
        public int user_id { get; set; }
        public string username { get; set; }
        public string fullname { get; set; }
        public string position { get; set; }
        public string department { get; set; }
    }
}
