using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MecsTimeKeeper.Models
{
    public class TimeKeepingInfos
    {
        public string OnBiometric { get; set; }
        public string OvertimeType { get; set; }
        public string DateValidStart { get; set; }
        public string DateValidEnd { get; set; }
        public string ShiftRefId { get; set; }
    }
}
