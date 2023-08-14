using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MecsTimeKeeper.Models
{
    public class BiometricInfo
    {
      
        public int Id { get; set; }
        public byte[] Data { get; set; }
        public byte[] ImageData { get; set; }
        public string TimeKeepingInfoId { get; set; }

    }
}
