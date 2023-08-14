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

namespace MPOS.Forms
{
    public partial class frmPaymentCharge : Form
    {
        private RequestHandler req = new RequestHandler();
        private frmPayment parentForm;

        public frmPaymentCharge(frmPayment form)
        {
            parentForm = form;
            InitializeComponent();
        }

        private void btnClear_Click(object sender, EventArgs e)
        {
            txtChargeAmount.Clear();
        }

        private void btnEnter_Click(object sender, EventArgs e)
        {

            if (
                !string.IsNullOrEmpty(dtChargeDate.Value.ToString()) &&
                !string.IsNullOrEmpty(txtAmount.Text) &&
                !string.IsNullOrEmpty(txtChargeAmount.Text) &&
                !SystemApp.Instance.CheckZero(txtChargeAmount.Text)
               )
            {

                PaymentsList pay = new PaymentsList();
                PaymentCharge paycharge = new PaymentCharge
                {
                    charge_date = dtChargeDate.Value,
                    amount = decimal.Parse(txtAmount.Text),

                    // check this line
                    customer_id = SystemApp.Instance.SelectedOrder.customer_id
                };


                pay.payment_type = "CHARGE";
                pay.amount = paycharge.amount;
                pay.tendered = paycharge.amount;
                pay.details = paycharge;

                parentForm.ProcessPaymentDetails(pay);

                btnClear.PerformClick();
                txtAmount.Text = parentForm.balance_remaining.ToString("0.00");
                txtChargeAmount.Text = parentForm.balance_remaining.ToString("0.00");
            }
        }

        private void frmPaymentCharge_Load(object sender, EventArgs e)
        {
            txtAmount.Text = parentForm.balance_remaining.ToString("0.00");
            txtChargeAmount.Text = parentForm.balance_remaining.ToString("0.00");

            this.ActiveControl = txtChargeAmount;
        }

        
    }
}
