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
    public partial class frmPaymentCheque : Form
    {
        private frmPayment parentForm;
        private RequestHandler req = new RequestHandler();
        public frmPaymentCheque(frmPayment form)
        {
            parentForm = form;
            InitializeComponent();
        }

        private void frmPaymentCheque_Load(object sender, EventArgs e)
        {
            txtAmount.Text = parentForm.balance_remaining.ToString("0.00");
            txtTender.Text = parentForm.balance_remaining.ToString("0.00");

            this.ActiveControl = txtTender;
        }

        

        private void btnEnter_Click(object sender, EventArgs e)
        {
            if (
                !string.IsNullOrEmpty(txtChequeNo.Text) &&
                !string.IsNullOrEmpty(dtChequeIssueDate.Value.ToString()) &&
                !string.IsNullOrEmpty(txtName.Text) &&
                !string.IsNullOrEmpty(txtType.Text) &&
                !string.IsNullOrEmpty(txtAmount.Text) &&
                !string.IsNullOrEmpty(txtTender.Text) &&
                !SystemApp.Instance.CheckZero(txtTender.Text)

            )
            {
                //var paymentDetails = new
                //{
                //    cheque_no = txtChequeNo.Text,
                //    issue_date = txtIssueDate.Text,
                //    name = txtName.Text,
                //    type = txtType.Text,
                //    amount = decimal.Parse(txtAmount.Text),
                //    tender = decimal.Parse(txtTender.Text)

                //};

                ////parentForm.ProcessPaymentDetails("CHEQUE", paymentDetails);


                PaymentsList pay = new PaymentsList();
                PaymentCheque paycheque = new PaymentCheque
                {
                    cheque_no = txtChequeNo.Text,
                    cheque_date = dtChequeIssueDate.Value,
                    cheque_name = txtName.Text,
                    type = txtType.Text,
                    amount = decimal.Parse(txtTender.Text)
                };


                pay.payment_type = "CHEQUE";
                pay.amount = paycheque.amount;
                pay.tendered = paycheque.amount;
                pay.details = paycheque;

                parentForm.ProcessPaymentDetails(pay);

                btnClear.PerformClick();

                txtAmount.Text = parentForm.balance_remaining.ToString("0.00");
                txtTender.Text = parentForm.balance_remaining.ToString("0.00");
            }
        }

        private void btnClear_Click(object sender, EventArgs e)
        {
            txtChequeNo.Clear();
            dtChequeIssueDate.ResetText();
            txtName.Clear();
            txtType.Clear();
        }

       
    }
}
