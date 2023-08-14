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
    public partial class frmPayment : Form
    {
        private frmOrders parentForm;
        private RequestHandler req = new RequestHandler();
        List<PaymentsList> PayList = new List<PaymentsList>();
        private SalesOrder reqsalesOrder = new SalesOrder();

        public decimal originalTotalAmountDue = 0;
        public decimal total_amount_due = 0;
        public decimal total_amount_paid = 0;
        public decimal balance_paid = 0;
        public decimal balance_remaining = 0;
        public decimal change_amount = 0;

        public decimal total_payments_amount = 0;
        private int selected_payment_rowindex = -1;
        private string last_process_invoice_no = null;
        public string customer_name = "";

        public decimal total_amount_due_with_deduction = 0;
        public decimal total_amount_due_without_deduction = 0;
        public decimal deduction_amount = 0;

        Boolean isDeduct1Perc = false;
        Boolean isDeductionApplied = false;


        public frmPayment(frmOrders form)
        {
            parentForm = form;
            InitializeComponent();
        }


        async private void frmPayment_Load(object sender, EventArgs e)
        {

            parentForm.isPaymentFormOpen = true;

            //clear the payment list
            SystemApp.Instance.PaymentsList.Clear();
            lblCustomerName.ResetText();

            last_process_invoice_no = null;

            //var checkkk = SystemApp.Instance.SelectedOrderTotal.total_amount_due;

            btnSubmit.Enabled = false;
            btnResetPayment.Enabled = false;
            btnRemovePayment.Enabled = false;

            //added to correct github issue #54 on mecssolutions/mecs-solidgold
            //calculate initially
            //add total of items to total_amount_due
            decimal total_items = 0;
            //foreach (SalesOrderItem item in SystemApp.Instance.SelectedOrder.order_items)
            //{
            //    decimal total_amount = item.sale_price * item.quantity;

            //    total_items = total_items + item.quantity;
            //    total_amount_due = total_amount_due + total_amount;
            //}
            ////add delivery fee to total_amount _due
            //total_amount_due = total_amount_due + SystemApp.Instance.SelectedOrder.delivery_fee;
            Results res = await req.SendGETRequest<Results>("sales/sales_orders/by_order_no/" + SystemApp.Instance.SelectedOrder.order_no, new
            {
                branch = SystemApp.Instance.SelectedBranch.branch_code
            });

            reqsalesOrder = res.data[0];

            foreach (SalesOrderItem item in reqsalesOrder.order_items)
            {
                decimal total_amount = item.sale_price * item.quantity;

                total_items = total_items + item.quantity;
                total_amount_due = total_amount_due + total_amount;
            }
            //add delivery fee to total_amount _due
            total_amount_due = total_amount_due + reqsalesOrder.delivery_fee;

            originalTotalAmountDue = total_amount_due;
            balance_remaining = total_amount_due - total_amount_paid;

            lblTotalAmountDue.Text = total_amount_due.ToString("#,##0.00");
            lblBalanceRemaining.Text = balance_remaining.ToString("#,##0.00");
            lblChangeAmount.Text = change_amount.ToString("#,##0.00");

            string customer = reqsalesOrder.customer_name;

            if (!string.IsNullOrEmpty(reqsalesOrder.cash_remark))
            {
                customer = customer + " ** " + reqsalesOrder.cash_remark;
            }



            lblCustomerName.Text = customer;
            customer_name = lblCustomerName.Text;


            //disable other payment methods other than cash if the customer is CASH
            if (reqsalesOrder.customer_name.ToLower() == "cash")
            {
                rdbCharge.Enabled = false;
                //rdbCheque.Enabled = false;
                rdbPaymentCash.Checked = true;
            }
            else
            {
                rdbCharge.Checked = true;
            }


            if (Properties.Settings.Default.IS_DEFAULT_CASH == 1)
            {
                rdbPaymentCash.Checked = true;
            }


        }

        private void CheckIfCanSubmitPayment()
        {
            if(total_amount_paid >= total_amount_due)
            {
                btnSubmit.Enabled = true;
            }else
            {
                btnSubmit.Enabled = false;
            }
        }

        public void ProcessPaymentDetails(PaymentsList paylist)
        {
            SystemApp.Instance.PaymentsList.Add(paylist);

            this.DisplayAndCalculatePayList();

            this.CheckIfCanSubmitPayment();

        }

        private void DisplayAndCalculatePayList()
        {
            //display to datagrid
            dgvPayments.Rows.Clear();
            total_amount_paid = 0;

            foreach (PaymentsList item in SystemApp.Instance.PaymentsList)
            {
                dgvPayments.Rows.Add(item.payment_type, item.amount.ToString("#,##0.00"), item.tendered.ToString("#,##0.00"));
                total_amount_paid = total_amount_paid + item.tendered;
            }

            //recalculate
            this.RecalculateAmounts();



            if (dgvPayments.Rows.Count > 0)
            {
                btnResetPayment.Enabled = true;
                btnRemovePayment.Enabled = true;

                selected_payment_rowindex = 0;
            }
            else
            {
                btnResetPayment.Enabled = false;
                btnRemovePayment.Enabled = false;
            }
        }

        async private void btnBack_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        async private void GetLastInvoiceForPrinting()
        {
            //get the last invoice no.
            // testing must trigger the invoice printing --> direct to Receipt Viewer

            /*ResultInvoice invoice = await SystemApp.Instance.API_BASE
                                  .AppendPathSegment("sales/sales_transactions/transactions/" + last_process_invoice_no)
                                  .GetJsonAsync<ResultInvoice>();*/

            ResultInvoice invoice = await req.SendGETRequest<ResultInvoice>("sales/sales_transactions/transactions/" + last_process_invoice_no, null);

            SystemApp.Instance.SelectedInvoice = invoice.data;

            //check invoice print type
            // show form selection

            if (SystemApp.Instance.SelectedInvoice.invoice_print_type == "trust_receipt")
            {
                // use the 1/2 report // trust receipt
                // do nothing
                frmReceiptViewer form_receiptviewer = new frmReceiptViewer(null);
                form_receiptviewer.ShowDialog();
            }
            else
            {
                // use the 1/4 paper // invoice receipt
                frmPrintType frmPrintType = new frmPrintType();
                frmPrintType.ShowDialog();
            }

            this.Close();

        }

        async private void btnSubmit_Click(object sender, EventArgs e)
        {


            //Console.WriteLine("ORIG total amount due " + originalTotalAmountDue);
            //Console.WriteLine("total amount due " + total_amount_due);
            //Console.WriteLine("dedcut amount" + deduction_amount);

            //Show  frmConfirmPayment
            object paymentData = new
            {
                total_due = total_amount_due,
                total_paid = total_amount_paid,
                balance_paid = balance_paid,
                balance_remaining = balance_remaining,
                change = change_amount
            };
            frmConfirmPayment f = new frmConfirmPayment(this, paymentData);

            //DialogResult dr = f.ShowDialog();
            //DialogResult dr = MessageBox.Show("Are you sure to proceed this Payment?", "Confirm Payment", MessageBoxButtons.YesNo, MessageBoxIcon.Information);

            if (f.ShowDialog() == DialogResult.Cancel)
            {
                return;
            }

            btnSubmit.Enabled = false;


            try
            {

                //submit the transaction
                //submit payment

                //1. create sales transaction
                //2. create sales transaction items
                //3. create payment
                //4. base on payment method, create payment methd details

                // Create Transaction
                SalesTransaction sales_transaction = new SalesTransaction
                {
                    customer_id = reqsalesOrder.customer_id,
                    transaction_type = reqsalesOrder.sales_type,

                    // chnage 20210704 to suppoort deduction
                    total_amount_due = total_amount_due,
                    //deduct_1perc_amount = deduction_amount,
                    //total_amount_due_without_deduct_1perc = originalTotalAmountDue,


                    invoice_no = null,
                    invoice_type = reqsalesOrder.sales_type,
                    //sales_transaction.total_amount_tendered = reqsalesOrderTotal.total_amount_paid;
                    change_amount = SystemApp.Instance.SelectedOrderTotal.change_amount,
                    total_discounted_amount = SystemApp.Instance.SelectedOrderTotal.total_discount,
                    status = "submitted",
                    user_id = SystemApp.Instance.AuthUser.user.user_id,
                    salesfront_user_id = reqsalesOrder.user_id,
                    branch_code = SystemApp.Instance.SelectedBranch.branch_code,
                    cash_remark = reqsalesOrder.cash_remark
                };


                // Create Transaction Items
                List<SalesTransactionItem> sales_transaction_items = new List<SalesTransactionItem>();

                foreach (SalesOrderItem item in reqsalesOrder.order_items)
                {
                    SalesTransactionItem trans = new SalesTransactionItem
                    {
                        product_id = item.product_id,
                        qty = item.quantity.ToString(),
                        price_per_unit = item.sale_price.ToString(),
                        unit = item.product.unit.selling_unit,
                        total_amount = (item.sale_price * item.quantity).ToString(),
                        delivery_qty = null,
                        remarks = item.remarks
                    };

                    sales_transaction_items.Add(trans);
                }


                // Create the delivery if have
                var delivery = new
                {
                    shipment = reqsalesOrder.shipment,
                    delivery_request_date = reqsalesOrder.delivery_request_date,
                    delivery_fee = reqsalesOrder.delivery_fee,
                    delivery_notes = reqsalesOrder.delivery_notes
                };


                // Check the payments
                // 1. charge?
                // 2. balance calculations
                // 3. payment status

                //if balance = 0 then paid
                //if balance > 0 then partial
                //if balance = total_amount_due then unpaid


                decimal allpaid = SystemApp.Instance.PaymentsList.Where(item => item.payment_type != "CHARGE").Sum(x => x.tendered);
                decimal allcharge = SystemApp.Instance.PaymentsList.Where(item => item.payment_type == "CHARGE").Sum(x => x.tendered);


                decimal balance_amount = total_amount_due - allpaid;

                sales_transaction.total_amount_tendered = allpaid;
                sales_transaction.balance_amount = balance_amount;



                // 20210704 change total amount dues to the calculated
                if (balance_amount == 0)
                {
                    sales_transaction.payment_status = "Paid";
                }

                if (balance_amount > 0 && balance_amount < total_amount_due)
                {
                    sales_transaction.payment_status = "Partial";
                }

                if (balance_amount == total_amount_due)
                {
                    sales_transaction.payment_status = "Unpaid";
                }


                // Create the payload
                var data = new
                {
                    sales_order_no = reqsalesOrder.order_no,
                    sales_transaction = sales_transaction,
                    sales_transaction_items = sales_transaction_items,
                    payments = SystemApp.Instance.PaymentsList,
                    delivery = delivery
                };


/*
                var result = await SystemApp.Instance.API_BASE
                                  .AppendPathSegment("sales/sales_orders/cashier_submit")
                                  .PostJsonAsync(data)
                                  .ReceiveJson();*/

                dynamic result = await req.SendPOSTRequest<dynamic>("sales/sales_orders/cashier_submit", data);


                //Console.WriteLine(result.data.invoice_no);

                if (result.data.invoice_no != null)
                {
                    btnSubmit.Enabled = true;
                    MessageBox.Show("Invoice and payment/s are created succesfully.", "Successful", MessageBoxButtons.OK, MessageBoxIcon.Information);


                    last_process_invoice_no = result.data.invoice_no;

                    // clear this object
                    parentForm.selectedSalesOrderNo = null;
                    SystemApp.Instance.SelectedOrder = new SalesOrder();
                    SystemApp.Instance.PaymentsList.Clear();
                    SystemApp.Instance.SelectedOrderTotal = new SalesOrderTotal();

                    //parentForm.InitTotals();
                    //parentForm.CheckNewSalesOrder();

                    this.GetLastInvoiceForPrinting();

                    //btnBack.PerformClick();
                }
                else
                {
                    MessageBox.Show("Error Encountered..");
                }

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }

        }

        private void btnRemovePayment_Click(object sender, EventArgs e)
        {
            // remove a selected payment row
            if(selected_payment_rowindex > -1)
            {
                //dgvPayments.Rows.RemoveAt(selected_payment_rowindex);

                //PayList.RemoveAt(selected_payment_rowindex);

                SystemApp.Instance.PaymentsList.RemoveAt(selected_payment_rowindex);

                //recalculate
                this.DisplayAndCalculatePayList();

                this.CheckIfCanSubmitPayment();

                //simulate change on thhe payment method
                rdbCreditCard.PerformClick();
                rdbPaymentCash.PerformClick();
            }


        }

        private void btnResetPayment_Click(object sender, EventArgs e)
        {
            // reset payments
            SystemApp.Instance.PaymentsList.Clear();
            //SystemApp.Instance.PaymentsList = new List<PaymentsList>();
            this.DisplayAndCalculatePayList();

            this.CheckIfCanSubmitPayment();

            //simulate change on thhe payment method
            rdbCreditCard.PerformClick();
            rdbPaymentCash.PerformClick();
        }

        private void rdbPaymentCash_CheckedChanged(object sender, EventArgs e)
        {
            panelPaymentForm.Controls.Clear();

            frmPaymentCash formCash = new frmPaymentCash(this)
            {
                TopLevel = false,
                FormBorderStyle = FormBorderStyle.None,
                Dock = DockStyle.Fill
            };
            panelPaymentForm.Controls.Add(formCash);
            formCash.Show();
        }

        private void rdbCreditCard_CheckedChanged(object sender, EventArgs e)
        {
            panelPaymentForm.Controls.Clear();

            frmPaymentCreditCard formCard = new frmPaymentCreditCard(this)
            {
                TopLevel = false,
                FormBorderStyle = FormBorderStyle.None,
                Dock = DockStyle.Fill
            };
            panelPaymentForm.Controls.Add(formCard);
            formCard.Show();
        }

        private void rdbCheque_CheckedChanged(object sender, EventArgs e)
        {
            panelPaymentForm.Controls.Clear();

            frmPaymentCheque formCheque = new frmPaymentCheque(this)
            {
                TopLevel = false,
                FormBorderStyle = FormBorderStyle.None,
                Dock = DockStyle.Fill,
                AutoScroll = true
            };
            panelPaymentForm.Controls.Add(formCheque);
            formCheque.Show();
        }

        private void rdbCharge_CheckedChanged(object sender, EventArgs e)
        {
            panelPaymentForm.Controls.Clear();

            frmPaymentCharge formCharge = new frmPaymentCharge(this)
            {
                TopLevel = false,
                FormBorderStyle = FormBorderStyle.None,
                Dock = DockStyle.Fill
            };
            panelPaymentForm.Controls.Add(formCharge);
            formCharge.Show();
        }

        private void dgvPayments_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            DataGridView dgv = sender as DataGridView;

            if (dgv == null)
                return;

            if(dgv.Rows.Count > 0)
            {
                if (dgv.CurrentRow.Selected)
                {
                    selected_payment_rowindex = dgv.CurrentRow.Index;
                }
            }

        }

        private void frmPayment_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Escape)
            {
                btnBack.PerformClick();
            }
        }

        private void frmPayment_FormClosed(object sender, FormClosedEventArgs e)
        {
            parentForm.isPaymentFormOpen = false;
            parentForm.TickTimer();
            parentForm.InitTotals();
        }

        private void frmPayment_FormClosing(object sender, FormClosingEventArgs e)
        {

        }

        private void cbDeduct1Perc_CheckedChanged(object sender, EventArgs e)
        {

            //this.isDeduct1Perc = cbDeduct1Perc.Checked;

            if (cbDeduct1Perc.Checked)
            {
                this.isDeduct1Perc = true;
                cbDeduct1Perc.BackColor = Color.Red;
            }
            else
            {
                this.isDeduct1Perc = false;
                cbDeduct1Perc.BackColor = Color.LightCoral;
            }

            this.RecalculateAmounts();


            rdbCreditCard.Checked = true;
            rdbPaymentCash.Checked = true;



            // Trigger Recalculate so that user can see it

        }


        private void RecalculateAmounts()
        {

            if (isDeduct1Perc)
            {
                // we need to decuct
                decimal constDiv = (decimal)1.12;

                decimal ans1 = originalTotalAmountDue / constDiv;
                deduction_amount = ans1 * (decimal)0.01;

                total_amount_due_with_deduction = originalTotalAmountDue - deduction_amount;
                total_amount_due = Math.Round(total_amount_due_with_deduction,2);

                //isDeductionApplied = true;
            }
            else
            {
                // no deduction
                total_amount_due = Math.Round(originalTotalAmountDue,2);

            }


            lblTotalAmountPaid.Text = total_amount_paid.ToString("#,##0.00");

            // check if over the total amount due
            if (total_amount_paid > total_amount_due)
            {
                balance_remaining = 0;
                change_amount = Math.Abs(total_amount_due - total_amount_paid);
            }
            else
            {
                balance_remaining = total_amount_due - total_amount_paid;
                change_amount = 0;
            }


            lblBalanceRemaining.Text = balance_remaining.ToString("#,##0.00");
            lblChangeAmount.Text = change_amount.ToString("#,##0.00");
            lblTotalAmountDue.Text = total_amount_due.ToString("#,##0.00");


            SystemApp.Instance.SelectedOrderTotal.total_amount_paid = total_amount_paid;
            SystemApp.Instance.SelectedOrderTotal.change_amount = change_amount;




            this.CheckIfCanSubmitPayment();


            //    public decimal total_amount_due_with_deduction = 0;
            //public decimal total_amount_due_without_deduction = 0;
            //public decimal deduction_amount = 0;



        }
    }
}
