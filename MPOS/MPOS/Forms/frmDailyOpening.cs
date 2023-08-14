using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using MPOS.Classes;
using MPOS.Models;
using Flurl;
using Flurl.Http;

namespace MPOS.Forms
{
    public partial class frmDailyOpening : Form
    {
        private RequestHandler req = new RequestHandler();
        public frmDailyOpening()
        {
            InitializeComponent();
        }

        private void frmDailyOpening_Load(object sender, EventArgs e)
        {
           this.ActiveControl = txtInitialCashAmount;
        }

        private void bntClose_Click(object sender, EventArgs e)
        {
            DialogResult dr = MessageBox.Show("Are you sure to exit this application?", "Confirm Exit", MessageBoxButtons.YesNo, MessageBoxIcon.Information);

            if (dr == DialogResult.Yes)
            {
                Application.Exit();
            }
        }

        async private void btnEnter_Click(object sender, EventArgs e)
        {
            DialogResult dr = MessageBox.Show("Are you sure to proceed?", "Confirm Opening Cash", MessageBoxButtons.YesNo, MessageBoxIcon.Information);

            if (dr == DialogResult.Yes)
            {
                //create
    /*            dynamic result = await SystemApp.Instance.API_BASE
                                 .AppendPathSegment("cashier/daily_transactions")
                                 .PostJsonAsync(new { payload = new {
                                     transaction_date = dtOpeningDate.Value.ToString("yyyy-MM-dd"),
                                     initial_cash_amount = decimal.Parse(txtInitialCashAmount.Text),
                                     branch_code = SystemApp.Instance.SelectedBranch.branch_code
                                 } })
                                 .ReceiveJson();*/
                await req.SendPOSTRequest("cashier/daily_transactions", new
                {
                    payload = new
                    {
                        transaction_date = dtOpeningDate.Value.ToString("yyyy-MM-dd"),
                        initial_cash_amount = decimal.Parse(txtInitialCashAmount.Text),
                        branch_code = SystemApp.Instance.SelectedBranch.branch_code
                    }
                });

                //Console.WriteLine(result);

                //query on api
              /*  DailyTransactionResult daily_tran = await SystemApp.Instance.API_BASE
                                .AppendPathSegment("/cashier/daily_transactions/" + DateTime.Now.ToString("yyyy-MM-dd") + "/branch/" + SystemApp.Instance.SelectedBranch.branch_code)
                                .GetJsonAsync<DailyTransactionResult>();*/

                DailyTransactionResult daily_tran = await req.SendGETRequest<DailyTransactionResult>("/cashier/daily_transactions/" + DateTime.Now.ToString("yyyy-MM-dd") + "/branch/" + SystemApp.Instance.SelectedBranch.branch_code, null);

                SystemApp.Instance.DailyTransaction = daily_tran.data;

                this.Close();

            }
        }
    }
}
