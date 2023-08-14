using Flurl;
using Flurl.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using MPOS.Forms;
using MPOS.Classes;
using MPOS.Models;
using Newtonsoft.Json;

namespace MPOS
{
    public partial class frmMain : Form
    {

        private RequestHandler req = new RequestHandler();

        public frmMain()
        {
            InitializeComponent();
        }



        async private void Form1_Load(object sender, EventArgs e)
        {
            //init

            //get the selected branch and decide the main logo
            switch (SystemApp.Instance.SelectedBranch.branch_code)
            {
                case "SG":
                    pboxMainLogo.ImageLocation = AppDomain.CurrentDomain.BaseDirectory + "//assets//sg.png";
                    break;

                case "EG":
                    pboxMainLogo.ImageLocation = AppDomain.CurrentDomain.BaseDirectory + "//assets//eg.png";
                    break;

                case "GM":
                    pboxMainLogo.ImageLocation = AppDomain.CurrentDomain.BaseDirectory + "//assets//gm.png";
                    break;

                case "HM":
                    pboxMainLogo.ImageLocation = AppDomain.CurrentDomain.BaseDirectory + "//assets//hm.png";
                    break;

                default:
                    break;
            }



            DateTime now = DateTime.Now;
            lblCurrentDateTime.Text = now.ToString("dddd , MMMM-dd-yyyy hh:mm:ss tt");

            tmrSystem.Start();



            lblUserLogged.Text = SystemApp.Instance.AuthUser.user.position + "[" + SystemApp.Instance.AuthUser.user.username + "]";
            lblSelectedBranch.Text = "Branch : " + SystemApp.Instance.SelectedBranch.name;


            //get passcode and put in memory
            /*dynamic passcode = await SystemApp.Instance.API_BASE
                             .AppendPathSegment("cashier/cashier/passcode/" + SystemApp.Instance.SelectedBranch.branch_code)
                             .GetJsonAsync();*/

          
            dynamic getpasscode = await req.SendGETRequest<dynamic>("cashier/cashier/passcode/" + SystemApp.Instance.SelectedBranch.branch_code, null);
            string passcode = getpasscode.data.starting_value;
            if (passcode != null)
            {
                // expandoObject.SomeMember exists.
                SystemApp.Instance.CashierPasscode = passcode;
            }
            else
            {
                MessageBox.Show("Error Encounter. Cannot retrieve cashier details.");
                Application.Exit();
            }




            //query on api
            /*DailyTransactionResult daily_tran = await SystemApp.Instance.API_BASE
                            .AppendPathSegment("/cashier/daily_transactions/" + DateTime.Now.ToString("yyyy-MM-dd") + "/branch/" + SystemApp.Instance.SelectedBranch.branch_code)
                            .GetJsonAsync<DailyTransactionResult>();*/

            DailyTransactionResult daily_tran = await req.SendGETRequest<DailyTransactionResult>("/cashier/daily_transactions/" + DateTime.Now.ToString("yyyy-MM-dd") + "/branch/" + SystemApp.Instance.SelectedBranch.branch_code, null);

            SystemApp.Instance.DailyTransaction = daily_tran.data;

            if (SystemApp.Instance.DailyTransaction == null)
            {
                //prompt
                frmDailyOpening fmrDailyOpening = new frmDailyOpening();
                fmrDailyOpening.ShowDialog();
            }

            btnOrders.PerformClick();
        }

        private void tmrSystem_Tick(object sender, EventArgs e)
        {
            DateTime now = DateTime.Now;
            lblCurrentDateTime.Text = now.ToString("dddd , MMMM-dd-yyyy hh:mm:ss tt");

            if (SystemApp.Instance.isDayClosed)
            {
                panelDayClosedWrapper.Visible = true;
            }else
            {
                panelDayClosedWrapper.Visible = false;
            }
        }






        private void HighlightSelectedPage(string button_text)
        {
            foreach (Button item in panelToolbar.Controls)
            {
                if(button_text == item.Text)
                {
                    item.BackColor = Color.White;
                }else
                {
                    item.BackColor = Color.LightGray;
                }
            }
        }




        private void btnOrders_Click(object sender, EventArgs e)
        {
            panelContent.Controls.Clear();
            frmOrders frmOrders = new frmOrders();
            frmOrders.TopLevel = false;
            frmOrders.FormBorderStyle = FormBorderStyle.None;
            frmOrders.Dock = DockStyle.Fill;
            panelContent.Controls.Add(frmOrders);
            frmOrders.Show();

            this.HighlightSelectedPage(btnOrders.Text);
        }

        private void btnTransactions_Click(object sender, EventArgs e)
        {
            panelContent.Controls.Clear();
            frmTransactions frmTrans = new frmTransactions();
            frmTrans.TopLevel = false;
            frmTrans.FormBorderStyle = FormBorderStyle.None;
            frmTrans.Dock = DockStyle.Fill;
            panelContent.Controls.Add(frmTrans);
            frmTrans.Show();
            this.HighlightSelectedPage(btnTransactions.Text);
        }

        private void btnReports_Click(object sender, EventArgs e)
        {
            panelContent.Controls.Clear();
            frmReports frmReports = new frmReports();
            frmReports.TopLevel = false;
            frmReports.FormBorderStyle = FormBorderStyle.None;
            frmReports.Dock = DockStyle.Fill;
            panelContent.Controls.Add(frmReports);
            frmReports.Show();
            this.HighlightSelectedPage(btnReports.Text);
        }



        private void btnExit_Click(object sender, EventArgs e)
        {

            DialogResult dr = MessageBox.Show("Are you sure to exit this application?", "Confirm Exit", MessageBoxButtons.YesNo, MessageBoxIcon.Information);

            if (dr == DialogResult.Yes)
            {
                Application.Exit();
            }else
            {
                // do nothing as shit.
            }
        }
    }
}
