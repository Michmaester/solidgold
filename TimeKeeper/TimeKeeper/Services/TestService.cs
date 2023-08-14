using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using MecsTimeKeeper.Models;
using System.Data.SqlClient;
using MecsTimeKeeper.Models;

namespace MecsTimeKeeper.Services
{
    class TestService
    {
        SqlConnection _conn = new SqlConnection();
        string connectionString = Properties.Settings.Default.ConnectionString;
        string table_name = "Users";

        //MySQLDatabase db = new MySQLDatabase();
        //private readonly MySqlConnection _conn;
        //private string table_name = "dishes";


        public TestService()
        {
            _conn = new SqlConnection(connectionString);
        }

        public IEnumerable<Users> GetUsers()
        {
            var sql = string.Format("SELECT * FROM {0}", table_name);
            var result = this._conn.Query<Users>(sql).ToList();
            return result;
        }

        //public Dishes GetDishesById(int id)
        //{
        //    var sql = string.Format("SELECT * FROM {0} WHERE id = @id", table_name);
        //    var result = this._conn.Query<Dishes>(sql, new { id = id }).FirstOrDefault();
        //    return result;
        //}

        //public int InsertData(string dish_cat_code, string dish_code, string barcode, string dish_name, string price)
        //{
        //    var sql = string.Format("INSERT INTO {0} (dish_cat_code,dish_code,barcode,dish_name,price) VALUES (@dish_cat_code,@dish_code,@barcode,@dish_name,@price)", table_name);
        //    return this._conn.Execute(sql, new { dish_cat_code = dish_cat_code, dish_code = dish_code, barcode = barcode, dish_name = dish_name, price = price });
        //}

        //public int UpdateData(int id, string dish_cat_code, string dish_code, string barcode, string dish_name, string price)
        //{
        //    var sql = string.Format("UPDATE {0} SET dish_cat_code = @dish_cat_code, dish_code = @dish_code, barcode = @barcode, dish_name = @dish_name, price = @price WHERE id = @id ", table_name);
        //    return this._conn.Execute(sql, new { dish_cat_code = dish_cat_code, dish_code = dish_code, barcode = barcode, dish_name = dish_name, price = price, id = id });
        //}

        //public int DeleteData(int id)
        //{
        //    var sql = string.Format("DELETE FROM {0} WHERE id = @id", table_name);
        //    return this._conn.Execute(sql, new { id = id });
        //}
    }
}
