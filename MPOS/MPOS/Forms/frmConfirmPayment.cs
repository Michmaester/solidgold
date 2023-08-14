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
using Flurl;
using Flurl.Http;
using MPOS.Models;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace MPOS.Forms
{
    public partial class frmConfirmPayment : Form
    {
        private frmPayment parentForm;

        public decimal total_amount_due = 0;

        public frmConfirmPayment(frmPayment form,dynamic data)
        {
            parentForm = form;
            total_amount_due = data.total_due;
            InitializeComponent();
        }
        public static bool HasDifferentCharacters(string input)
        {
            // Get the distinct characters from the string
            var distinctCharacters = input.Distinct();

            // If the count of distinct characters is greater than 1, return true
            return distinctCharacters.Count() > 1;
        }
        private void frmPayment_Load(object sender, EventArgs e)
        {
            lblTotalAmountDue.Text = total_amount_due.ToString("#,##0.00");

            //dgvPayments.Rows.Clear();
            decimal cash = 0;
            decimal cheque = 0;
            decimal credit_card = 0;
            decimal charge = 0;
            string paymentType = "";
            string checkString = "";
            //bool checkMultiple = SystemApp.Instance.PaymentsList.GroupBy(obj => obj.payment_type).All(group => group.Count() > 1);

            foreach (PaymentsList item in SystemApp.Instance.PaymentsList)
            {
                switch (item.payment_type)
                {
                    case "CASH":
                        cash += item.tendered;
                        checkString += "A";
                        paymentType = "CASH PAYMENT";
                        break;
                    case "CHARGE":
                        charge += item.tendered;
                        checkString += "B";
                        paymentType = "CHARGE PAYMENT";
                        break;
                    case "CHEQUE":
                        cheque += item.tendered;
                        checkString += "C";
                        paymentType = "CHEQUE PAYMENT";
                        break;
                    case "CREDITCARD":
                        credit_card += item.tendered;
                        checkString += "D";
                        paymentType = "CREDIT CARD PAYMENT";
                        break;
                    default:
                        break;
                }
            }


            if (HasDifferentCharacters(checkString))
            {
                paymentType = "MULTIPLE PAYMENTS";
            }
            lblCash.Text = cash.ToString("#,##0.00");
            lblCharge.Text = charge.ToString("#,##0.00");
            lblCheque.Text = cheque.ToString("#,##0.00");
            lblCreditCard.Text = credit_card.ToString("#,##0.00");

            btnSubmit.Text = $"CONFIRM {paymentType}";
        }

        async private void btnBack_Click(object sender, EventArgs e)
        {
            this.DialogResult = DialogResult.Cancel;
            this.Close();
        }


        async private void btnSubmit_Click(object sender, EventArgs e)
        {
            this.DialogResult = DialogResult.OK;
            this.Close();
        }

        private void frmPayment_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Escape)
            {
                btnBack.PerformClick();
            }
        }
    }
}
