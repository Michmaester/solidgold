using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MecsTimeKeeper.Classes
{
    public sealed class SystemApp
    {

        private static readonly SystemApp instance = new SystemApp();

        public Boolean isAdmin = false;


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

    }
}
