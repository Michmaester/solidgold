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
    public partial class frmDailyClosing : Form
    {
        private RequestHandler req = new RequestHandler();
        List<ClosingItem> ClosingItems = new List<ClosingItem>();

        decimal initial_cash_amount;
        decimal total_sales_collection;
        decimal total_net_accountability;
        decimal short_overt_amount;
        decimal daily_total_expense;


        decimal payments_totals_creditcard;
        decimal payments_totals_cheque;
        decimal payments_totals_charge;

        private frmOrders parentForm;

        public frmDailyClosing(frmOrders form)
        {
            parentForm = form;
            InitializeComponent();
        }

        async private void frmDailyClosing_Load(object sender, EventArgs e)
        {
            //read the daily transaction

            //query on api
            /*DailyTransactionResult daily_tran = await SystemApp.Instance.API_BASE
                         .AppendPathSegment("cashier/daily_transactions/" + DateTime.Now.ToString("yyyy-MM-dd") + "/branch/" + SystemApp.Instance.SelectedBranch.branch_code)
                         .GetJsonAsync<DailyTransactionResult>();*/

            DailyTransactionResult daily_tran = await req.SendGETRequest<DailyTransactionResult>("cashier/daily_transactions/" + DateTime.Now.ToString("yyyy-MM-dd") + "/branch/" + SystemApp.Instance.SelectedBranch.branch_code,null);

            SystemApp.Instance.DailyTransaction = daily_tran.data;




/*
            var totalsales_res = await SystemApp.Instance.API_BASE
                             .AppendPathSegment("cashier/cashier/get_cashier_total_netsales")
                             .SetQueryParams(new
                             {
                                 date = DateTime.Now.ToString("yyyy-MM-dd"),
                                 branch = SystemApp.Instance.SelectedBranch.branch_code
                             })
                             .GetJsonAsync();*/


            var totalsales_res = await req.SendGETRequest<dynamic>("cashier/cashier/get_cashier_total_netsales", new
            {
                date = DateTime.Now.ToString("yyyy-MM-dd"),
                branch = SystemApp.Instance.SelectedBranch.branch_code
            });




            lblDailyTransDate.Text = DateTime.Parse(SystemApp.Instance.DailyTransaction.transaction_date).ToString("MMMM dd, yyyy");
            initial_cash_amount = (decimal)SystemApp.Instance.DailyTransaction.initial_cash_amount;
            //Console.WriteLine(initial_cash_amount);

            // important ----------------->
            // need to get the total sales transactions processed today
            total_net_accountability = (decimal)totalsales_res.data.totals;


            // query the API here for an updated data

            if (SystemApp.Instance.DailyTransaction.closing_datetime == null)
            {

                payments_totals_creditcard = (decimal)totalsales_res.data.totals_card;
                payments_totals_cheque = (decimal)totalsales_res.data.totals_cheque;
                payments_totals_charge = (decimal)totalsales_res.data.totals_charges;

                this.InitGridValues();
            }
            else
            {
                txtDailyTotalExpense.Text = SystemApp.Instance.DailyTransaction.daily_total_expense.ToString();
                lblInitialAmount.Text = SystemApp.Instance.DailyTransaction.initial_cash_amount.ToString();
                lblSalesCollection.Text = SystemApp.Instance.DailyTransaction.total_sales_collection.ToString();
                lblTotalNetAccountability.Text = SystemApp.Instance.DailyTransaction.total_net_accountability.ToString();
                lblShortOver.Text = SystemApp.Instance.DailyTransaction.short_over_amount.ToString();

                List<ClosingItem> Items = new List<ClosingItem>();

                // Sort the list
                Items = SystemApp.Instance.DailyTransaction.closing_items.OrderByDescending(item => item.id).ToList();

                // Create and Insert "Cash" row
                ClosingItem NewItem = new ClosingItem();
                NewItem.paytype = "Cash";

                Items.Insert(3, NewItem);

                int counter = 0;
                foreach (ClosingItem item in Items)
                {
                    if (counter > 3)
                    {
                        dgvList.Rows.Add(item.bills, item.cash_qty, item.equiv);
                    }
                    else if (counter == 3)
                    {
                        dgvList.Rows.Add(item.paytype, null, null);
                    }
                    else
                    {
                        dgvList.Rows.Add(item.paytype,null,item.equiv);
                    }

                    dgvList.ReadOnly = true;

                    counter++;

                }

                dgvList.Rows[3].DefaultCellStyle.BackColor = Color.Black;
                dgvList.Rows[3].DefaultCellStyle.ForeColor = Color.White;



                txtDailyTotalExpense.Enabled = false;

                btnSave.Enabled = false;


            }







        }

        private void InitGridValues()
        {
            // testing -----------> make this dynamic

            dgvList.Rows.Add("Charge");
            dgvList.Rows.Add("Cheque");
            dgvList.Rows.Add("Credit Card");
            dgvList.Rows.Add("Cash");

            dgvList.Rows.Add("1000");
            dgvList.Rows.Add("500");
            dgvList.Rows.Add("200");
            dgvList.Rows.Add("100");
            dgvList.Rows.Add("50");
            dgvList.Rows.Add("20");
            dgvList.Rows.Add("10");
            dgvList.Rows.Add("5");
            dgvList.Rows.Add("1");
            dgvList.Rows.Add("0.50");
            dgvList.Rows.Add("0.25");
            dgvList.Rows.Add("0.10");


            dgvList.Rows[0].Cells["CashQty"].ReadOnly = true;
            dgvList.Rows[1].Cells["CashQty"].ReadOnly = true;
            dgvList.Rows[2].Cells["CashQty"].ReadOnly = true;

            dgvList.Rows[3].Cells["CashQty"].ReadOnly = true;
            dgvList.Rows[3].Cells["Equivalent"].ReadOnly = true;

            dgvList.Rows[4].Cells["Equivalent"].ReadOnly = true;
            dgvList.Rows[5].Cells["Equivalent"].ReadOnly = true;
            dgvList.Rows[6].Cells["Equivalent"].ReadOnly = true;
            dgvList.Rows[7].Cells["Equivalent"].ReadOnly = true;
            dgvList.Rows[8].Cells["Equivalent"].ReadOnly = true;
            dgvList.Rows[9].Cells["Equivalent"].ReadOnly = true;
            dgvList.Rows[10].Cells["Equivalent"].ReadOnly = true;
            dgvList.Rows[11].Cells["Equivalent"].ReadOnly = true;
            dgvList.Rows[12].Cells["Equivalent"].ReadOnly = true;
            dgvList.Rows[13].Cells["Equivalent"].ReadOnly = true;
            dgvList.Rows[14].Cells["Equivalent"].ReadOnly = true;
            dgvList.Rows[15].Cells["Equivalent"].ReadOnly = true;

            dgvList.Rows[3].DefaultCellStyle.BackColor = Color.Black;
            dgvList.Rows[3].DefaultCellStyle.ForeColor = Color.White;

            this.GenerateInitialValues();

            this.GenerateColors();

            this.CalculateClosingTotals();
        }


        private void GenerateColors()
        {
            foreach (DataGridViewRow row in dgvList.Rows)
            {
                if (row.Cells["Equivalent"].ReadOnly == false)
                {
                    var test = row.Cells["Equivalent"].Value;
                    if (test == null)
                    {
                        row.Cells["Equivalent"].Style.BackColor = Color.PaleVioletRed;
                    }else
                    {
                        row.Cells["Equivalent"].Style.BackColor = Color.Azure;
                    }
                }
                else
                {
                    //do nothing
                }

                if (row.Cells["CashQty"].ReadOnly == false)
                {
                    var test = row.Cells["CashQty"].Value;
                    if (test == null)
                    {
                        row.Cells["CashQty"].Style.BackColor = Color.Red;
                    }
                    else
                    {
                        row.Cells["CashQty"].Style.BackColor = Color.Azure;
                    }
                }
                else
                {
                    //do nothing
                }
            }
            //dgvList.Rows[rowIndex].Cells[columnIndex].Style.BackColor = Color.Red;
        }

        private void dgvList_CellEndEdit(object sender, DataGridViewCellEventArgs e)
        {

            var row = e.RowIndex;
            var col = e.ColumnIndex;

            //check first if null or empty
            if (dgvList.Rows[row].Cells[col].Value == null){
                dgvList.Rows[row].Cells[col].Value = 0;
            }
            else
            {
                //check if numeric
                decimal n;
                var isNumeric = decimal.TryParse(dgvList.Rows[row].Cells[col].Value.ToString(), out n);

                if (isNumeric)
                {
                    this.GenerateColors();
                    if (col == 1)
                    {
                        //calculate
                        decimal bill = decimal.Parse(dgvList.Rows[row].Cells[col - 1].Value.ToString());
                        int pcs = int.Parse(dgvList.Rows[row].Cells[col].Value.ToString());

                        decimal equiv = bill * pcs;

                        dgvList.Rows[row].Cells[col + 1].Value = equiv;
                    }

                }
                else
                {
                    dgvList.Rows[row].Cells[col].Value = 0;
                }
            }

            this.CalculateClosingTotals();
        }

        private void dgvList_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if ((e.RowIndex == 3))
            {
                dgvList.ClearSelection();
            }
        }



        private void CalculateClosingTotals()
        {
            ClosingItems.Clear();

            int counter = 0;

            foreach (DataGridViewRow row in dgvList.Rows)
            {
                ClosingItem closingItem = new ClosingItem();

                if (counter == 3)
                {
                    counter++;
                    continue;
                }
                else
                {
                    if (counter >= 4)
                    {
                        //cash
                        closingItem.bills = decimal.Parse(row.Cells[0].Value.ToString());
                        closingItem.paytype = "Cash";
                        closingItem.cash_qty = float.Parse(row.Cells[1].Value.ToString());
                        closingItem.equiv = decimal.Parse(row.Cells[2].Value.ToString());
                    }
                    else
                    {
                        //cheque/card/charge
                        closingItem.paytype = row.Cells[0].Value.ToString();
                        closingItem.equiv = decimal.Parse(row.Cells[2].Value.ToString());
                    }
                }

                ClosingItems.Add(closingItem);

                counter++;
            }

            this.CalculateGridTotals();
        }

        private void GenerateInitialValues()
        {
            int counter = 0;

            foreach (DataGridViewRow row in dgvList.Rows)
            {
                ClosingItem closingItem = new ClosingItem();

                if (counter == 3)
                {
                    counter++;
                    continue;
                }
                else
                {
                    if (counter >= 4)
                    {
                        //cash
                        row.Cells[1].Value = 0;
                        row.Cells[2].Value = 0;
                    }
                    else
                    {
                        //cheque/card/charge
                        row.Cells[2].Value = 0;
                    }
                }
                counter++;
            }


            dgvList.Rows[0].Cells[2].Value = payments_totals_charge;
            dgvList.Rows[1].Cells[2].Value = payments_totals_cheque;
            dgvList.Rows[2].Cells[2].Value = payments_totals_creditcard;
            //charge
            //cheque
            //creditcard


        }


        private void CalculateGridTotals()
        {

            // daily expense should be here


            total_sales_collection = ClosingItems.Sum(item => item.equiv);
            //lblSalesCollection.Text = total_sales_collection.ToString("#,##0.00");

            lblInitialAmount.Text = initial_cash_amount.ToString("#,##0.00");

            lblSalesCollection.Text = total_sales_collection.ToString("#,##0.00");

            lblTotalNetAccountability.Text = total_net_accountability.ToString("#,##0.00");

            short_overt_amount = ((initial_cash_amount + total_sales_collection) - total_net_accountability) - daily_total_expense;
            lblShortOver.Text = short_overt_amount.ToString("#,##0.00");

        }

        async private void btnSave_Click(object sender, EventArgs e)
        {
            //send to api

            DialogResult dr = MessageBox.Show("Are you sure to proceed? Please double check all details before confirming. This action is not reversible.", "Confirm Daily Closing Details", MessageBoxButtons.YesNo, MessageBoxIcon.Warning);

            if (dr == DialogResult.Yes)
            {
                //create

                //if successful then requery it and ssave to memory
                DailyTransactionResult daily_tran = await SystemApp.Instance.API_BASE
                            .AppendPathSegment("/cashier/daily_transactions/" + DateTime.Now.ToString("yyyy-MM-dd") + "/branch/" + SystemApp.Instance.SelectedBranch.branch_code)
                            .GetJsonAsync<DailyTransactionResult>();

                SystemApp.Instance.DailyTransaction = daily_tran.data;


                await SystemApp.Instance.API_BASE
                    .AppendPathSegment("cashier/daily_transactions/day_closing")
                    .PostJsonAsync(new
                    {
                        payload = new
                        {
                            id = SystemApp.Instance.DailyTransaction.id,
                            total_sales_collection = total_sales_collection,
                            total_net_accountability = total_net_accountability,
                            short_over_amount = short_overt_amount,
                            daily_total_expense = daily_total_expense,
                            closing_items = ClosingItems
                        }
                    })
                    .ReceiveJson();

                //call a method on parent to disabled actions because we already have a dayend closing
                SystemApp.Instance.isDayClosed = true;
                parentForm.DisableActionsWhenDayClosed();

                this.Close();

            }


        }

        private void panel1_Paint(object sender, PaintEventArgs e)
        {

        }

        private void txtDailyTotalExpense_TextChanged(object sender, EventArgs e)
        {

            decimal tmp_dailytotal_expense = 0;

            if (string.IsNullOrEmpty(txtDailyTotalExpense.Text))
            {
                //assume as 0
                tmp_dailytotal_expense = 0;
            }
            else
            {
                tmp_dailytotal_expense = decimal.Parse(txtDailyTotalExpense.Text);
            }

            //check should be digit/numeric only
            daily_total_expense = tmp_dailytotal_expense;

            this.CalculateClosingTotals();
        }
    }
}
