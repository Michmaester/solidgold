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
    class DailyTimeRecordService
    {

        SQLiteConnection _conn = new SQLiteConnection();
        string table_name = "daily_time_records";


        public DailyTimeRecordService()
        {
            _conn = new SQLiteConnection(@"Data Source=" + Environment.CurrentDirectory + "\\" + Properties.Settings.Default.DatabaseName + ";Version=3;");
        }


        public IEnumerable<DailyTimeRecord> GetDailyTimeRecords()
        {
            try
            {
                var sql = string.Format("SELECT * FROM {0}", table_name);
                var result = this._conn.Query<DailyTimeRecord>(sql).ToList();
                return result;
            }
            catch (Exception ex)
            {

                throw;
            }
            
        }

        public DailyTimeRecord GetDailyTimeRecord(int emp_id, string date_today)
        {
            try
            {
                var sql = string.Format("SELECT * FROM {0} WHERE emp_id = @emp_id AND date(dtr_datetime) = @date_today ", table_name);
                var result = this._conn.Query<DailyTimeRecord>(sql, new { emp_id = emp_id, date_today = date_today }).FirstOrDefault();

                return result;
            }
            catch (Exception ex)
            {

                Console.WriteLine(ex.Message);

                throw;
            }
            
        }


        public IEnumerable<DailyTimeRecord> GetTimeKeepingInfosByEmployee(int emp_id)
        {
            var sql = string.Format("SELECT * FROM {0} WHERE emp_id = @emp_id", table_name);
            var result = this._conn.Query<DailyTimeRecord>(sql, new { emp_id = emp_id }).ToList();
            return result;
        }




        public string GenerateDtrId(string branch_code, int emp_id)
        {
            try
            {
                var sql = string.Format("SELECT id FROM {0} ORDER BY id DESC LIMIT 1", table_name);
                int lastId = this._conn.Query<int>(sql).SingleOrDefault();

                //increment
                int incId = lastId + 1;
                string newDtrId = branch_code + emp_id + "-" + incId;

                return newDtrId;
            }
            catch (Exception ex)
            {

                Console.WriteLine(ex.Message);

                throw;
            }

        }


        public int InsertDailyTimeRecord(string dtr_id, int emp_id, string dtr_datetime, string branch_code, int sync_flag)
        {

            try
            {
                var sql = string.Format("INSERT INTO {0} (dtr_id,emp_id,dtr_datetime,branch_code,sync_flag) VALUES (@dtr_id,@emp_id,@dtr_datetime,@branch_code,@sync_flag)", table_name);

                return this._conn.Execute(sql, new
                {
                    dtr_id = dtr_id,
                    emp_id = emp_id,
                    dtr_datetime = dtr_datetime,
                    branch_code =branch_code,
                    sync_flag = sync_flag,
                });
            }
            catch (Exception ex)
            {
                System.Windows.Forms.MessageBox.Show(ex.Message);
                throw;
            }
            
        }




    }
}
