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
    public partial class frmPaymentCreditCard : Form
    {
        private frmPayment parentForm;
        private RequestHandler req = new RequestHandler();
        public frmPaymentCreditCard(frmPayment form)
        {
            parentForm = form;
            InitializeComponent();
        }

        private void frmPaymentCreditCard_Load(object sender, EventArgs e)
        {
            txtAmount.Text = parentForm.balance_remaining.ToString("0.00");
            this.ActiveControl = txtCardNo;
        }

        

        private void btnEnter_Click(object sender, EventArgs e)
        {
            if (
                !string.IsNullOrEmpty(txtCardNo.Text) &&
                !string.IsNullOrEmpty(txtAccountName.Text) &&
                !string.IsNullOrEmpty(dtCardExpirationDate.Value.ToString()) &&
                !string.IsNullOrEmpty(txtConfirmationCode.Text) &&
                !string.IsNullOrEmpty(txtAmount.Text) &&
                !SystemApp.Instance.CheckZero(txtAmount.Text)
            )
            {

                PaymentsList pay = new PaymentsList();
                PaymentCard paycard = new PaymentCard
                {
                    card_no = txtCardNo.Text,
                    account_name = txtAccountName.Text,
                    expiration_date = dtCardExpirationDate.Value,
                    confirmation_code = txtConfirmationCode.Text,
                    amount = decimal.Parse(txtAmount.Text)
                };

                pay.payment_type = "CREDITCARD";
                pay.amount = paycard.amount;
                pay.tendered = paycard.amount;
                pay.details = paycard;

                parentForm.ProcessPaymentDetails(pay);

                btnClear.PerformClick();

                txtAmount.Text = parentForm.balance_remaining.ToString("0.00");
            }else
            {
                MessageBox.Show("Error not complete");
            }
        }

        private void btnClear_Click(object sender, EventArgs e)
        {
            txtCardNo.Clear();
            txtAccountName.Clear();
            txtConfirmationCode.Clear();
        }

        
    }
}
