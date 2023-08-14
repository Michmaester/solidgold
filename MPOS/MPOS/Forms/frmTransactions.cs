using Flurl;
using Flurl.Http;
using MPOS.Classes;
using MPOS.Forms;
using MPOS.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MPOS
{
    public partial class frmTransactions : Form
    {
        private RequestHandler req = new RequestHandler();

        decimal total_cash = 0;
        decimal total_creditcard = 0;
        decimal total_cheque = 0;
        decimal total_sales = 0;
        decimal total_charges = 0;


        public frmTransactions()
        {
            InitializeComponent();
        }

        async private void btnGenerate_Click(object sender, EventArgs e)
        {

            try
            {

                // Get Sales Transactions
                // get also the counts of payments by payment method
                /*   ResultTransactions transactions = await SystemApp.Instance.API_BASE
                                     .AppendPathSegment("sales/sales_transactions/cashier_trans")
                                     .SetQueryParams(new
                                     {
                                         datefrom = dtDateFrom.Value.ToString("yyyy-MM-dd"),
                                         dateto = dtDateTo.Value.ToString("yyyy-MM-dd"),
                                         branch_code = SystemApp.Instance.SelectedBranch.branch_code
                                     })
                                     .GetJsonAsync<ResultTransactions>();*/

                ResultTransactions transactions = await req.SendGETRequest<ResultTransactions>(
                       "sales/sales_transactions/cashier_trans",
                       new
                       {
                           datefrom = dtDateFrom.Value.ToString("yyyy-MM-dd"),
                           dateto = dtDateTo.Value.ToString("yyyy-MM-dd"),
                           branch_code = SystemApp.Instance.SelectedBranch.branch_code
                       }
                   );
                /*   var datefrom = dtDateFrom.Value.ToString("yyyy-MM-dd");
                   var dateto = dtDateTo.Value.ToString("yyyy-MM-dd");
                   var branch_code = SystemApp.Instance.SelectedBranch.branch_code;
                   ResultTransactions transactions = await req.SendGETRequest<ResultTransactions>($"sales/sales_transactions/cashier_trans?datefrom={datefrom}&dateto={dateto}&branch_code={branch_code}");
   */
          /*      JObject myObject = new JObject();
                myObject = transactions;
                string jsonString = myObject.ToString();
                var transaction = JsonConvert.DeserializeObject<ResultTransactions>(jsonString);*/

                //need to calculate payaments methods..... ?????????

                List<SalesTransaction> SalesTransactions = new List<SalesTransaction>();
                PaymentTotals PaymentTotals = new PaymentTotals();

                SalesTransactions = transactions.data;
                PaymentTotals = transactions.payments_totals;

                dgvTransactions.Rows.Clear();

                foreach (SalesTransaction item in SalesTransactions)
                {
                    dgvTransactions.Rows.Add(
                        item.invoice_no,
                        item.transaction_date.ToString("MMM-d-yyyy HH:mm tt"),
                        item.customer.name,
                        item.salesfront.fullname,
                        item.invoice_type,
                        item.total_amount_due
                    );
                }

                total_cash = PaymentTotals.cash;
                total_creditcard = PaymentTotals.card;
                total_cheque = PaymentTotals.cheque;
                total_charges = PaymentTotals.charges;
                total_sales = PaymentTotals.salesTotals;

                //display to labels
                lblTotalCash.Text = total_cash.ToString("#,##0.00");
                lblTotalCreditCard.Text = total_creditcard.ToString("#,##0.00");
                lblTotalCheque.Text = total_cheque.ToString("#,##0.00");
                lblTotalCharges.Text = total_charges.ToString("#,##0.00");
                lblTotalSales.Text = total_sales.ToString("#,##0.00");


            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                MessageBox.Show(ex.Message);
                throw;
            }
        }



        private void frmTransactions_Load(object sender, EventArgs e)
        {
            dtDateFrom.Value = DateTime.Now;
            dtDateTo.Value = DateTime.Now;
        }

        private void lblTotalCash_Click(object sender, EventArgs e)
        {

        }

        private void panel2_Paint(object sender, PaintEventArgs e)
        {

        }

        async private void dgvTransactions_CellDoubleClick(object sender, DataGridViewCellEventArgs e)
        {

            DataGridView dgv = sender as DataGridView;

            if (dgv == null)
            {
                return;
            }
            else
            {
                if (dgv.CurrentRow == null)
                {
                    return;
                }
                else
                {
                    if (dgv.CurrentRow.Selected && e.RowIndex > -1)
                    {
                        //get the invoice number
                        string invoice_no = dgvTransactions.Rows[e.RowIndex].Cells[0].Value.ToString();

                        /*ResultInvoice invoice = await SystemApp.Instance.API_BASE
                                              .AppendPathSegment("sales/sales_transactions/transactions/" + invoice_no)
                                             // .WithOAuthBearerToken()
                                              .GetJsonAsync<ResultInvoice>();*/

                        ResultInvoice invoice = await req.SendGETRequest<ResultInvoice>("sales/sales_transactions/transactions/" + invoice_no, null);

                        SystemApp.Instance.SelectedInvoice = invoice.data;

                        // show a form here to show the invoice details
                        frmInvoiceDetails form_invoiceDetails = new frmInvoiceDetails(this);

                        form_invoiceDetails.ShowDialog();
                    }
                }
            }

        }

        private void button1_Click(object sender, EventArgs e)
        {
            frmInvoiceDetails form_invoiceDetails = new frmInvoiceDetails(this);

            form_invoiceDetails.ShowDialog();
        }
    }
}
