using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using Dapper;
using System.Text;
using System.Threading.Tasks;
using MecsTimeKeeper.Models;

namespace MecsTimeKeeper.Services
{
    class TimeKeepingInfoService
    {

        SqlConnection _conn = new SqlConnection();
        string connectionString = Properties.Settings.Default.ConnectionString;
        string table_name = "TimeKeepingInfoes";


        public TimeKeepingInfoService()
        {
            _conn = new SqlConnection(connectionString);
        }


        public IEnumerable<TimeKeepingInfos> GetTimeKeepingInfos()
        {
            var sql = string.Format("SELECT * FROM {0}", table_name);
            var result = this._conn.Query<TimeKeepingInfos>(sql).ToList();
            return result;
        }

        public TimeKeepingInfos GetTimeKeepingInfo(int id)
        {
            var sql = string.Format("SELECT * FROM {0} WHERE id = @id", table_name);
            var result = this._conn.Query<TimeKeepingInfos>(sql, new { id = id }).FirstOrDefault();
            return result;
        }

        public int InsertTimeKeepingInfo(int on_biometric)
        {
            var sql = string.Format("INSERT INTO {0} (OnBiometric,OvertimeType,DateValidStart,DateValidEnd,ShiftRefId) VALUES (@on_biometric,@overtime_type,@date_validstart,@date_validend,@shift_refid)", table_name);

            return this._conn.Execute(sql, new {
                on_biometric = on_biometric,
                overtime_type = "Regular",
                date_validstart = "2020-12-01 00:00:00",
                date_validend = "2020-12-01 00:00:00",
                shift_refid = 1
            });
        }


        public int UpdateTimeKeepingInfo(int id, int on_biometric)
        {
            var sql = string.Format("UPDATE {0} SET OnBiometric = @on_biometric WHERE Id = @id ", table_name);
            return this._conn.Execute(sql, new { on_biometric = on_biometric, id = id });
        }


        //public Dishes GetDishesById(int id)
        //{
        //    var sql = string.Format("SELECT * FROM {0} WHERE id = @id", table_name);
        //    var result = this._conn.Query<Dishes>(sql, new { id = id }).FirstOrDefault();
        //    return result;
        //}



    }
}
