using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MecsTimeKeeper.Models
{
    public class EmploymentInfo
    {
        public string Id { get; set; }
        public string DateEmployed { get; set; }
        public string IsRegular { get; set; }
        public string SSSNo { get; set; }
        public string PhilHealthNo { get; set; }
        public string Designation { get; set; }
        public string DailyRate { get; set; }
        public string PAGIBIGNo { get; set; }
        public string TIN { get; set; }
        public string SSSDeduction { get; set; }
        public string PHDeduction { get; set; }
        public string PAGIBIGDeduction { get; set; }
        public string TaxDeduction { get; set; }
        public string EmployeeEmploymentInfo_EmploymentInfo_Id { get; set; }
        public string DeductionRate { get; set; }

    }
}
