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

namespace MPOS.Forms
{
    public partial class frmPaymentCash : Form
    {
        private frmPayment parentForm;
        private RequestHandler req = new RequestHandler();
        public frmPaymentCash(frmPayment form)
        {
            parentForm = form;
            InitializeComponent();
        }

        private void frmPaymentCash_Load(object sender, EventArgs e)
        {
            txtAmount.Text = parentForm.balance_remaining.ToString("0.00");
            txtTender.Text = parentForm.balance_remaining.ToString("0.00");

            this.ActiveControl = txtTender;
        }

        private void btnEnter_Click(object sender, EventArgs e)
        {

            if (!string.IsNullOrEmpty(txtAmount.Text) && !string.IsNullOrEmpty(txtTender.Text) && !SystemApp.Instance.CheckZero(txtTender.Text))
            {

                PaymentsList pay = new PaymentsList();
                PaymentCash paycash = new PaymentCash
                {
                    amount = decimal.Parse(txtTender.Text)
                };

                pay.payment_type = "CASH";
                pay.amount = decimal.Parse(txtAmount.Text);
                pay.tendered = decimal.Parse(txtTender.Text);
                pay.details = paycash;

                parentForm.ProcessPaymentDetails(pay);

                btnClear.PerformClick();

                txtAmount.Text = parentForm.balance_remaining.ToString("0.00");
                txtTender.Text = parentForm.balance_remaining.ToString("0.00");
            }
            else
            {
                MessageBox.Show("Invalid details.");
            }
        }

        private void btnClear_Click(object sender, EventArgs e)
        {

            txtTender.Text = 0.ToString("#,##0.00");
        }

        private void frmPaymentCash_Activated(object sender, EventArgs e)
        {
            //Console.WriteLine("activated...");
        }
    }
}
