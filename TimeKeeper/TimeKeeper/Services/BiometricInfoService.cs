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
    class BiometricInfoService
    {

        SqlConnection _conn = new SqlConnection();
        string connectionString = Properties.Settings.Default.ConnectionString;
        string table_name = "BiometricInfoes";


        public BiometricInfoService()
        {
            _conn = new SqlConnection(connectionString);
        }


        public IEnumerable<BiometricInfo> GetBiometricInfos()
        {
            var sql = string.Format("SELECT * FROM {0}", table_name);
            var result = this._conn.Query<BiometricInfo>(sql).ToList();
            return result;
        }

        public IEnumerable<BiometricInfo> GetBiometricInfos(int emp_id)
        {
            var sql = string.Format("SELECT * FROM {0} WHERE TimeKeepingInfoId = @emp_id", table_name);
            var result = this._conn.Query<BiometricInfo>(sql, new { emp_id = emp_id }).ToList();
            return result;
        }

        public BiometricInfo GetBiometricInfo(int id)
        {
            var sql = string.Format("SELECT * FROM {0} WHERE TimeKeepingInfoId = @id", table_name);
            var result = this._conn.Query<BiometricInfo>(sql,new { id = id }).FirstOrDefault();
            return result;
        }

        public int GetLastBiometricInfoByEmp(int emp_id)
        {
            var sql = string.Format("SELECT TOP 1 Id FROM {0} WHERE TimeKeepingInfoId = @emp_id ORDER BY Id DESC", table_name);
            var result = this._conn.Query(sql, new { emp_id = emp_id }).FirstOrDefault();
            return result.Id;
        }

        public int GetEmployeeIdByFId(int fid)
        {
            var sql = string.Format("SELECT TimeKeepingInfoId FROM {0} WHERE Id = @fid", table_name);
            var result = this._conn.Query(sql, new { fid = fid }).FirstOrDefault();
            return result.TimeKeepingInfoId;
        }

        public int CountEmployeeEnrolledTemplates(int emp_id)
        {
            var sql = string.Format("SELECT count(Id) as template_count FROM {0} WHERE TimeKeepingInfoId = @emp_id", table_name);
            var result = this._conn.Query(sql, new { emp_id = emp_id }).FirstOrDefault();
            return result.template_count;
        }

        public int InsertBiometricInfo(int timekeeping_id, byte[] imagedata)
        {
            var sql = string.Format("INSERT INTO {0} (Finger,Data,ImageData,TimeKeepingInfoId) VALUES (@finger,@data,@imagedata,@timekeeping_id)", table_name);

            return this._conn.Execute(sql, new {
                finger = 0,
                data = imagedata,
                imagedata = imagedata,
                timekeeping_id = timekeeping_id
            });
        }

        //public int UpdateData(int id, string dish_cat_code, string dish_code, string barcode, string dish_name, string price)
        //{
        //    var sql = string.Format("UPDATE {0} SET dish_cat_code = @dish_cat_code, dish_code = @dish_code, barcode = @barcode, dish_name = @dish_name, price = @price WHERE id = @id ", table_name);
        //    return this._conn.Execute(sql, new { dish_cat_code = dish_cat_code, dish_code = dish_code, barcode = barcode, dish_name = dish_name, price = price, id = id });
        //}

        public int DeleteBiometricInfo(int id)
        {
            var sql = string.Format("DELETE FROM {0} WHERE TimeKeepingInfoId = @id", table_name);
            return this._conn.Execute(sql, new { id = id });
        }

    }
}
