using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using Dapper;
using System.Text;
using System.Threading.Tasks;
using MecsTimeKeeper.Models;
using System.Data.SQLite;

namespace MecsTimeKeeper.Services
{
    class FingerprintService
    {
        SQLiteConnection _conn = new SQLiteConnection();
        string table_name = "fingerprints";


        public FingerprintService()
        {
            _conn = new SQLiteConnection(@"Data Source=" + Environment.CurrentDirectory + "\\" + Properties.Settings.Default.DatabaseName + ";Version=3;");
        }


        public IEnumerable<Finger> GetFingers()
        {
            var sql = string.Format("SELECT * FROM {0}", table_name);
            var result = this._conn.Query<Finger>(sql).ToList();
            return result;
        }

       

        public int InsertFinger(int emp_id,byte[] finger_template)
        {
            try
            {
                var sql = string.Format("INSERT INTO {0} (finger_template,emp_id) VALUES (@finger_template,@emp_id)", table_name);

                return this._conn.Execute(sql, new
                {
                    emp_id = emp_id,
                    finger_template = finger_template,
                });
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw;
            }
            
        }

       
    }
}
