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
    class EmployeeService
    {

        SQLiteConnection _conn = new SQLiteConnection();
        string table_name = "employees";


        public EmployeeService()
        {
            _conn = new SQLiteConnection(@"Data Source=" + Environment.CurrentDirectory + "\\" + Properties.Settings.Default.DatabaseName + ";Version=3;");

        }


        // Get all employees
        public IEnumerable<Employee> GetEmployees()
        {
            try
            {
                var sql = string.Format("SELECT * FROM {0}", table_name);
                var result = this._conn.Query<Employee>(sql).ToList();
                return result;
            }
            catch (Exception e)
            {
                System.Windows.Forms.MessageBox.Show(e.Message);
                //System.Windows.Forms.MessageBox.Show("Database error. Make sure database server is reachable. Re-run the application.");
                return Enumerable.Empty<Employee>();
            }
            
        }

        // Get a single employee
        public Employee GetEmployee(int emp_id)
        {
            var sql = string.Format("SELECT * FROM {0} WHERE id = @emp_id", table_name);
            var result = this._conn.Query<Employee>(sql, new { emp_id = emp_id }).FirstOrDefault();
            return result;
        }

        // Insert Employee
        public int InsertEmployee(string first_name,string middle_name, string last_name,string user_name, string password, string id_no, string status)
        {

            try
            {
                var sql = string.Format("INSERT INTO {0} (first_name,middle_name,last_name,user_name,password,id_no,status) VALUES (@first_name,@middle_name,@last_name,@user_name,@password,@id_no,@status)", table_name);

                return this._conn.Execute(sql, new
                {
                    first_name = first_name,
                    middle_name = middle_name,
                    last_name = last_name,
                    user_name = user_name,
                    password  = password,
                    id_no = id_no,
                    status = status
                });
            }
            catch (Exception ex)
            {
                throw;
            }

        }

        



        // Update the timekeeping_id of a single employee
        public int UpdateEmployee(int emp_id, int timekeeping_id)
        {
            var sql = string.Format("UPDATE {0} SET TimeKeepingInfo_Id = @timekeeping_id WHERE Id = @emp_id ", table_name);
            return this._conn.Execute(sql, new { timekeeping_id = timekeeping_id, emp_id = emp_id });
        }


    }
}
