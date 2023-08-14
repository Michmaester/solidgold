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
using MPOS.Models;
using MPOS.Classes;

namespace MPOS
{

    public partial class frmLogin : Form
    {

        BranchResult BranchResults;
        private RequestHandler req = new RequestHandler();


        public frmLogin()
        {
            InitializeComponent();
        }
        async private void frmLogin_Load(object sender, EventArgs e)
        {
            this.ActiveControl = txtUsername;

            // get all branches
/*            BranchResults = await SystemApp.Instance.API_BASE
                             .AppendPathSegment("masterdata/branches")
                             .GetJsonAsync<BranchResult>();
*/
            /**/
            BranchResults = await req.SendGETRequest<BranchResult>("masterdata/branches", null);

            for (int i = 0; i < BranchResults.data.Count(); i++)
            {
                ComboboxItem item = new ComboboxItem();
                item.Text = BranchResults.data[i].name;
                item.Value = BranchResults.data[i].branch_code;

                cmbBranch.Items.Add(item);
            }


            cmbBranch.SelectedIndex = Properties.Settings.Default.BRANCH;



            // debuggging ---> auto login
            //txtUsername.Text = "admin";
            //txtPassword.Text = "atbtorc@9";
            //cmbBranch.SelectedIndex = 0;

            //btnLogin.PerformClick();
        }



        async private void btnClear_Click(object sender, EventArgs e)
        {

            //var status = "submitted";
            //var status = "processed";

            txtUsername.Clear();
            txtPassword.Clear();

            //listBox1.Items.Clear();

            //// Get a list of todos from the 'JSONPlaceholder' API.
            //Results results = await SystemApp.Instance.API_BASE
            //                  .AppendPathSegment("sales/sales_orders/status/" + status)
            //                  .GetJsonAsync<Results>();

            //foreach (SalesOrder item in results.data)
            //{
            //    listBox1.Items.Add(item.order_no);
            //}

            //Console.WriteLine(results.data[0].order_no);
        }

        private void btnClose_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        async private void btnLogin_Click(object sender, EventArgs e)
        {

            if (string.IsNullOrEmpty(txtUsername.Text)) return;

            if (string.IsNullOrEmpty(txtPassword.Text)) return;

            if (SystemApp.Instance.SelectedBranch == null) return;

            try
            {
                /*  Auth loggedUser = await SystemApp.Instance.API_BASE
                                   .AppendPathSegment("auth/login")
                                   .PostJsonAsync(new { username = txtUsername.Text, password = txtPassword.Text })
                                   .ReceiveJson<Auth>();*/
                Auth loggedUser = await req.SendPOSTRequest<Auth>("auth/login", new { username = txtUsername.Text, password = txtPassword.Text });


                if (loggedUser.user.position.ToLower() == "administrator" || loggedUser.user.position.ToLower() == "cashier")
                {
                    Properties.Settings.Default.JWT = loggedUser.token;
                    SystemApp.Instance.AuthUser = loggedUser;
                    //if correct
                    frmMain frmMain = new frmMain();
                    frmMain.Show();
                    this.Hide();
                }
                else
                {
                    MessageBox.Show("You are not authorized.");
                }

            }
            catch (FlurlHttpTimeoutException ext)
            {
                // FlurlHttpTimeoutException derives from FlurlHttpException; catch here only
                // if you want to handle timeouts as a special case
                //LogError("Request timed out.");
                MessageBox.Show(ext.Message);
            }
            catch (FlurlHttpException ex)
            {
                // ex.Message contains rich details, inclulding the URL, verb, response status,
                // and request and response bodies (if available)
                dynamic d = ex.GetResponseJsonAsync();
                MessageBox.Show(d.Result.message);
            }





        }

        private void timer1_Tick(object sender, EventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {
            List<PaymentsList> paylist = new List<PaymentsList>();

            PaymentsList pay = new PaymentsList();

            PaymentCard paycard = new PaymentCard();
            PaymentCash paycash = new PaymentCash();


            //1
            paycard.account_name = "Ralphskie";
            paycard.amount = 100;
            paycard.bank_id = 1;

            pay.amount = 100;
            pay.tendered = 100;
            pay.details = paycard;

            paylist.Add(pay);

            pay = new PaymentsList();
            paycash.amount = 200;
            paycash.id = 1;

            pay.amount = 200;
            pay.tendered = 200;
            pay.details = paycash;


            paylist.Add(pay);

            Console.WriteLine(paylist);


        }

        private void panel1_Paint(object sender, PaintEventArgs e)
        {

        }

        private void cmbBranch_SelectedValueChanged(object sender, EventArgs e)
        {
            Branch selbranch = new Branch();

            selbranch.name = (cmbBranch.SelectedItem as ComboboxItem).Text.ToString();
            selbranch.branch_code = (cmbBranch.SelectedItem as ComboboxItem).Value.ToString();

            SystemApp.Instance.SelectedBranch = selbranch;
        }
    }
}

public class ComboboxItem
{
    public string Text { get; set; }
    public object Value { get; set; }

    public override string ToString()
    {
        return Text;
    }
}
