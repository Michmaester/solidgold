using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MPOS.Models;

namespace MPOS.Classes
{

    public sealed class SystemApp
    {
        private static readonly SystemApp instance = new SystemApp();


        public string API_BASE = Properties.Settings.Default.API_BASEURL;


        //payment object
        public Auth AuthUser;
        public Branch SelectedBranch;
        public SalesTransaction SelectedTransaction;
        public SalesOrder SelectedOrder;
        public SalesOrderItem SelectedOrderItem;
        public SalesOrderTotal SelectedOrderTotal;
        public List<PaymentsList> PaymentsList = new List<PaymentsList>();
        public DailyClosing DailyTransaction;
        public SalesTransaction SelectedInvoice;


        public string CashierPasscode;

        public Boolean isDayClosed = false;
        public Boolean isBigPrint = false;


        // Explicit static constructor to tell C# compiler
        // not to mark type as beforefieldinit
        static SystemApp()
        {
        }

        private SystemApp()
        {
        }

        public static SystemApp Instance
        {
            get
            {
                return instance;
            }
        }
        
        public bool CheckPasscode(string passcode)
        {
            if(passcode == CashierPasscode)
            {
                return true;
            }else
            {
                return false;
            }
        }

        public bool CheckZero(string value)
        {
            decimal result;
            if(decimal.TryParse(value, out result))
            {
                //check result
                if(result == 0)
                {
                    return true;
                }else
                {
                    return false;
                }
            }else
            {
                return true;
            }

            //Console.WriteLine(result);
            //return test;
            //if (decimal.Parse(value) == 0)
            //{
            //    return true;
            //}else { return false; }
        }
    }
}
