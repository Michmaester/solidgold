﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPOS.Models
{
   
    public class ResultInvoice
    {
        public SalesTransaction data { get; set; }
        public string status { get; set; }
    }
}
