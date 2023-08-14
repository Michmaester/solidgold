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
    class UserloginService
    {

        SQLiteConnection _conn = new SQLiteConnection();
        string table_name = "userlogins";


        public UserloginService()
        {
            _conn = new SQLiteConnection(@"Data Source=" + Environment.CurrentDirectory + "\\" + Properties.Settings.Default.DatabaseName + ";Version=3;");
        }

        public bool CheckUserLogin(string username, string password)
        {
            try
            {

                var sql = string.Format("SELECT id FROM {0} WHERE username = @username and password = @password", table_name);
                int res = this._conn.Query<int>(sql, new { username = username, password = password }).SingleOrDefault();

                if (res > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }

                
            }
            catch (Exception ex)
            {

                Console.WriteLine(ex.Message);

                throw;
            }
        }

        public int InsertUserLogins(string username,string password)
        {

            try
            {
                var sql = string.Format("INSERT INTO {0} (username,password) VALUES (@username,@password)", table_name);

                return this._conn.Execute(sql, new
                {
                    username = username,
                    password = password
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
