using MPOS.Classes;
using MPOS.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MPOS.Forms
{

    public partial class frmInvoiceDetails : Form
    {
        private RequestHandler req = new RequestHandler();
        private frmTransactions parentForm;

        public frmInvoiceDetails(frmTransactions form)
        {
            parentForm = form;

            InitializeComponent();
        }

        private void btnEnter_Click(object sender, EventArgs e)
        {

        }

        private void frmInvoiceDetails_Load(object sender, EventArgs e)
        {
            // init big print as false
            SystemApp.Instance.isBigPrint = false;

            //load
            lblInvoiceNo.Text = SystemApp.Instance.SelectedInvoice.invoice_no;
            lblInvoiceDate.Text = SystemApp.Instance.SelectedInvoice.transaction_date.ToString("MMM-d-yyyy HH:mm tt");
            lblCustomer.Text = SystemApp.Instance.SelectedInvoice.customer.name;
            lblSalesType.Text = SystemApp.Instance.SelectedInvoice.transaction_type;

            lblTotalAmountDue.Text = SystemApp.Instance.SelectedInvoice.total_amount_due.ToString("#,##0.00");
            lblTotalTendered.Text = SystemApp.Instance.SelectedInvoice.total_amount_tendered.ToString("#,##0.00");
            lblBalance.Text = SystemApp.Instance.SelectedInvoice.balance_amount.ToString("#,##0.00");
            lblPaymentStatus.Text = SystemApp.Instance.SelectedInvoice.payment_status.ToString();
            lblDeductionAmount.Text = SystemApp.Instance.SelectedInvoice.deduct_1perc_amount?.ToString("#,##0.00");



            //control the big print button display
            if (SystemApp.Instance.SelectedInvoice.invoice_print_type == "trust_receipt")
            {
                // use the 1/2 report // trust receipt
                btnBigPrint.Visible = false;
            }
            else
            {
                // use the 1/4 paper // invoice receipt
                btnBigPrint.Visible = true;
            }



            //iterate

            dgvInvoiceItems.Rows.Clear();

            //check wether the object is instantiated
            if (SystemApp.Instance.SelectedInvoice.trans_items != null)
            {
                foreach (SalesTransactionItem item in SystemApp.Instance.SelectedInvoice.trans_items)
                {
                    dgvInvoiceItems.Rows.Add(
                        item.product.product_code,
                        item.product.name,
                        item.product.description,
                        item.product.brand.brandname,
                        item.product.unit.item_unit,
                        item.qty,
                        item.price_per_unit,
                        item.total_amount
                    );
                }
            }



        }

        private void frmInvoiceDetails_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Escape)
            {
                this.Close();
            }
        }

        private void btnPrint_Click(object sender, EventArgs e)
        {
            // print
            // show the receipt viewer here and render the receipt for printing
            frmReceiptViewer form_receiptviewer = new frmReceiptViewer(this);
            form_receiptviewer.ShowDialog();
        }

        private void frmInvoiceDetails_FormClosed(object sender, FormClosedEventArgs e)
        {
            SystemApp.Instance.SelectedInvoice = null;
        }


        public void TriggerFormClose()
        {
            this.Close();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            SystemApp.Instance.isBigPrint = false;
            frmReceiptViewer form_receiptviewer = new frmReceiptViewer(this);
            form_receiptviewer.ShowDialog();
        }

        private void btnBigPrint_Click(object sender, EventArgs e)
        {
            SystemApp.Instance.isBigPrint = true;
            frmReceiptViewer form_receiptviewer = new frmReceiptViewer(this);
            form_receiptviewer.ShowDialog();
        }
    }
}
