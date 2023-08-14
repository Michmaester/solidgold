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
    class DailyTimeLogService
    {

        SQLiteConnection _conn = new SQLiteConnection();
        string table_name = "daily_time_logs";


        public DailyTimeLogService()
        {
            _conn = new SQLiteConnection(@"Data Source=" + Environment.CurrentDirectory + "\\" + Properties.Settings.Default.DatabaseName + ";Version=3;");
        }


        public IEnumerable<DailyTimeLog> GetDailyTimeLogs(string dtr_id)
        {

            try
            {
                var sql = string.Format("SELECT * FROM {0} WHERE dtr_id = @dtr_id ORDER BY id DESC", table_name);
                var result = this._conn.Query<DailyTimeLog>(sql, new { dtr_id = dtr_id }).ToList();
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
            
        }


        public int GetScanningDiffinMinutes(string dtr_id, string datetime_now)
        {
            try
            {
                
                // old
                //var sql = string.Format("SELECT TOP 1 DATEDIFF(MINUTE, Date, @datetime_now) AS minute_diff FROM {0} where DailyTimeRecordId = @dtr_id ORDER BY Id DESC", table_name);

                var sql = string.Format("Cast((JulianDay(dtl_datetime) - JulianDay(@datetime_now)) * 24 * 60 As Integer) as minute_diff FROM {0} where dtr_id = @dtr_id ORDER BY id DESC", table_name);

                var result = this._conn.Query(sql, new { dtr_id = dtr_id, datetime_now = datetime_now }).FirstOrDefault();
                return result.minute_diff;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }

            
        }

      

        public int GetLastLogShift(string dtr_id)
        {
            try
            {
                var sql = string.Format("SELECT shift_no AS shift FROM {0} where dtr_id = @dtr_id ORDER BY id DESC LIMIT 1", table_name);
                var result = this._conn.Query(sql, new { dtr_id = dtr_id }).FirstOrDefault();
                return result.shift;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }


        }


        public int InsertDailyTimeLog(string dtr_id, int emp_id, string dtl_datetime, int shift_no, string branch_code, int sync_flag)
        {

            try
            {
                var sql = string.Format("INSERT INTO {0} (dtr_id,emp_id,dtl_datetime,shift_no,branch_code,sync_flag) VALUES (@dtr_id,@emp_id,@dtl_datetime,@shift_no,@branch_code,@sync_flag)", table_name);

                return this._conn.Execute(sql, new
                {
                    dtr_id = dtr_id,
                    emp_id = emp_id,
                    dtl_datetime = dtl_datetime,
                    shift_no = shift_no,
                    branch_code = branch_code,
                    sync_flag = sync_flag

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
