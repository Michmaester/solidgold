using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using MecsTimeKeeper.Classes;
using MecsTimeKeeper.Services;

namespace MecsTimeKeeper.Forms
{

     

    public partial class frmLogin : Form
    {

        UserloginService sUserlogin = new UserloginService();

        private frmMain parentForm;

        public frmLogin(frmMain form)
        {
            parentForm = form;
            InitializeComponent();
        }

        private void btnLogin_Click(object sender, EventArgs e)
        {
            // query local db here

            if((string.IsNullOrEmpty(txtUsername.Text) || string.IsNullOrEmpty(txtPassword.Text)))
            {
                MessageBox.Show("Please provide complete details.");
            }
            else
            {
                //query the database
                var res = sUserlogin.CheckUserLogin(txtUsername.Text, txtPassword.Text);
                if (res)
                {
                    SystemApp.Instance.isAdmin = true;
                    parentForm.AuthenticationCheck();

                    this.Close();
                }
                else
                {
                    SystemApp.Instance.isAdmin = false;
                    MessageBox.Show("Invalid credentials.");
                }

            }

        }

        private void btnLock_Click(object sender, EventArgs e)
        {
            SystemApp.Instance.isAdmin = false;
            parentForm.AuthenticationCheck();

            this.Close();
        }

        private void frmLogin_Load(object sender, EventArgs e)
        {
            this.ActiveControl = txtUsername;

            //txtUsername.Text = "admin";
            //txtPassword.Text = "123";
            //btnLogin.PerformClick();
        }
    }
}
