using Flurl;
using Flurl.Http;
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
using MPOS.Forms;
using MPOS.Classes;

namespace MPOS
{
    public partial class frmOrders : Form
    {

        private RequestHandler req = new RequestHandler();
        public string selectedSalesOrderNo = null;
        int selectedOrderItemIndex = -1;

        List<SalesOrder> SalesOrders = new List<SalesOrder>();
        List<SalesOrder> SalesOrdersTmp = new List<SalesOrder>();
        //SalesOrder SelectedSalesOrder = new SalesOrder();
        Results SalesOrderResults;

        int total_items = 0;
        decimal total_discount = 0;
        decimal total_amount_due = 0;
        decimal delivery_fee = 0;


        public bool isPaymentFormOpen = false;
        public bool isStopRefresh = false;

        public frmOrders()
        {
            InitializeComponent();

            // when switching form, form wll be insattiated again, so need to remember
            // the reviosuly selected order

            // temporary comment ---> check bug

            //if(SystemApp.Instance.SelectedOrder != null)
            //{
            //    selectedSalesOrderNo = SystemApp.Instance.SelectedOrder.order_no;
            //    this.SelectPreviousOrderNo(selectedSalesOrderNo);
            //}

            //SalesOrderTotal orderTotals = new SalesOrderTotal();
            //orderTotals.total_amount_due = 0;
            //orderTotals.total_items = 0;
            //orderTotals.total_discount = 0;

            //SystemApp.Instance.SelectedOrderTotal = orderTotals;


        }

        public void InitTotals()
        {

            total_items = 0;

            total_amount_due = 0;

            if(total_discount == 0)
            {
                total_discount = 0;
            }else
            {
                total_discount = SystemApp.Instance.SelectedOrderTotal.total_discount;
            }


            //total_amount_due = SystemApp.Instance.SelectedOrderTotal.total_amount_due;
            //total_items = SystemApp.Instance.SelectedOrderTotal.total_items;
            //total_discount = SystemApp.Instance.SelectedOrderTotal.total_discount;

            lblTotalAmountDue.Text = (total_amount_due + delivery_fee).ToString("#,##0.00");
            lblTotalItems.Text = total_items.ToString();
            lblTotalDiscount.Text = total_discount.ToString("0.00");
            lblDeliveryFee.Text = "0.00";
        }

        private void frmOrders_Load(object sender, EventArgs e)
        {

            dtOrderDate.Value = DateTime.Now;
            if (SystemApp.Instance.DailyTransaction != null)
            {
                if (!string.IsNullOrEmpty(SystemApp.Instance.DailyTransaction.closing_datetime))
                {
                    SystemApp.Instance.isDayClosed = true;
                }
                else
                {
                    SystemApp.Instance.isDayClosed = false;
                }
            }
            else
            {
                SystemApp.Instance.isDayClosed = true;
            }


            if (SystemApp.Instance.isDayClosed)
                {
                    this.DisableActionsWhenDayClosed();
                }
                else
                {
                    //init check
                    this.CheckNewSalesOrder();

                    //start interval check
                    tmrData.Start();

                    this.CheckOrderSelection();
                }
            label1.Focus();
        }

        async public void CheckNewSalesOrder()
        {
            var status = "submitted";

            dgvSalesOrders.Rows.Clear();

            // Get Sales Order
           /* SalesOrderResults = await SystemApp.Instance.API_BASE
                              .AppendPathSegment("sales/sales_orders/get_cashier")
                              .SetQueryParams(new {
                                    date = dtOrderDate.Value.ToString("yyyy-MM-dd"),
                                    status = status,
                                    branch = SystemApp.Instance.SelectedBranch.branch_code
                              })
                              .GetJsonAsync<Results>();
*/
            SalesOrderResults = await req.SendGETRequest<Results>("sales/sales_orders/get_cashier"
                             ,new
                             {
                                 date = dtOrderDate.Value.ToString("yyyy-MM-dd"),
                                 status = status,
                                 branch = SystemApp.Instance.SelectedBranch.branch_code
                             });

            //render
            //check if have data, if not then do not render
            if (SalesOrderResults.data.Count > 0)
            {
                this.RenderSalesOrderList();
            }else
            {
                dgvSalesOrders.Rows.Clear();
                dgvSalesOrderItems.Rows.Clear();
            }

        }

        private void RenderSalesOrderList()
        {

            //check if selected order_no is in the list
            // if yes -> do not overwrite it.
            // only overwrite is order_no is not selected

            //filtered and takeout

            // sept-21-2020 : change process, will directly update using api for any changes
            // needs checking

            //SalesOrders = SalesOrderResults.data.Where(x => x.order_no != selectedSalesOrderNo).ToList();

            SalesOrders = SalesOrderResults.data.OrderByDescending(o => o.id).ToList();

            // commented feb-22-2021
            //if (selectedSalesOrderNo != null)
            //{
            //    SalesOrdersTmp = SalesOrders;
            //    SalesOrders = SalesOrdersTmp.OrderByDescending(o => o.id).ToList();
            //}

            dgvSalesOrderItems.Rows.Clear();
            dgvSalesOrders.Rows.Clear();

            foreach (SalesOrder item in SalesOrders)
            {
                string customer = item.customer_name + "  -  " + item.customer_address;

                if (!string.IsNullOrEmpty(item.cash_remark))
                {
                    customer = customer + " ** " + item.cash_remark;
                }

                dgvSalesOrders.Rows.Add(
                    customer,
                    item.order_date.ToString("MMM-d-yyyy HH:mm tt"),
                    item.order_no,
                    item.shipment,
                    item.sales_type
                );
            }


            dgvSalesOrders.ClearSelection();

            //programatically select the previous selected row base on the order_no
            this.SelectPreviousOrderNo(selectedSalesOrderNo);

            this.ChangeItemSelectedToolbarStatus();
        }
        int counter = 0;
        private void DisplaySalesOrderItems()
        {

            if (SystemApp.Instance.SelectedOrder != null)
            {
                if(SystemApp.Instance.SelectedOrder.order_no != null)
                {
                    // check this
                    SystemApp.Instance.SelectedOrder = SalesOrders.Where(x => x.order_no == SystemApp.Instance.SelectedOrder.order_no).First();

                    //total_items = 0;
                    //total_amount_due = 0;
                    //total_discount = 0;

                    this.InitTotals();


                    dgvSalesOrderItems.Rows.Clear();

                    //if (counter == 2)
                    //{
                    //    btnPayment.PerformClick();
                    //    counter = 0;
                    //}
                    //else
                    //{
                    //    counter++;
                    //}

                    int rowcnt = 1;
                    foreach (SalesOrderItem item in SystemApp.Instance.SelectedOrder.order_items)
                    {
                        decimal total_amount = item.sale_price * item.quantity;

                        total_items = total_items + item.quantity;
                        total_amount_due = total_amount_due + total_amount;

                        string prod_rem = item.product.name;

                        if (!string.IsNullOrEmpty(item.remarks))
                        {
                            prod_rem = item.product.name + " ** " + item.remarks;
                        }


                        dgvSalesOrderItems.Rows.Add(
                            rowcnt,
                            item.product.brand.brandname,
                            prod_rem,
                            item.product.description,
                            item.quantity,
                            item.product.unit.selling_unit,
                            item.sale_price.ToString("0.00"),
                            total_amount.ToString("0.00"),
                            item.product_id,
                            item.order_no,
                            item.id
                        );

                        rowcnt++;
                    }
                    dgvSalesOrderItems.ClearSelection();

                    delivery_fee = SystemApp.Instance.SelectedOrder.delivery_fee;
                    total_amount_due = total_amount_due + delivery_fee;

                    this.CalculateSelectedOrderTotals();
                }


            }
        }

        public void CalculateSelectedOrderTotals()
        {
            // total amount has laready the added delivery fee
            total_amount_due = total_amount_due - total_discount;


            lblTotalAmountDue.Text = total_amount_due.ToString("#,##0.00");
            lblTotalItems.Text = total_items.ToString();
            lblTotalDiscount.Text = total_discount.ToString("#,##0.00");
            lblDeliveryFee.Text = SystemApp.Instance.SelectedOrder.delivery_fee.ToString("#,##0.00");

            SalesOrderTotal orderTotals = new SalesOrderTotal
            {
                order_no = SystemApp.Instance.SelectedOrder.order_no,
                customer_id = SystemApp.Instance.SelectedOrder.customer_id,
                customer_name = SystemApp.Instance.SelectedOrder.customer_name,
                total_items = total_items,
                total_discount = total_discount,

                total_amount_due = total_amount_due
            };

            SystemApp.Instance.SelectedOrderTotal = orderTotals;
        }

        private void tmrData_Tick(object sender, EventArgs e)
        {
            this.TickTimer();
        }

        public void TickTimer()
        {
            if (isPaymentFormOpen == false && isStopRefresh == false)
            {
                //if (SystemApp.Instance.SelectedOrder != null)
                //{
                //    Console.WriteLine(SystemApp.Instance.SelectedOrder.order_no);
                //}

                this.CheckNewSalesOrder();
                this.CheckOrderSelection();
            }
        }

        private void CheckOrderSelection()
        {
            if (SystemApp.Instance.SelectedOrder == null)
            {
                panelOrderToolbar.Enabled = false;
            }
            else
            {
                if(SystemApp.Instance.SelectedOrder.order_no != null)
                {
                    panelOrderToolbar.Enabled = true;
                }
                else
                {
                    panelOrderToolbar.Enabled = false;
                }

            }
        }

        private void SelectPreviousOrderNo(string selected_order_no)
        {


            // check if it is null
            if (string.IsNullOrEmpty(selected_order_no))
            {
                // check instance if also null
                if(SystemApp.Instance.SelectedOrder != null)
                {
                    if(SystemApp.Instance.SelectedOrder.order_no != null)
                    {
                        selected_order_no = SystemApp.Instance.SelectedOrder.order_no;
                    }
                }
            }

                // -----> CHECK this because its always has some exception

            if (!string.IsNullOrEmpty(selected_order_no))
            {
                int rowIndex = -1;
                foreach (DataGridViewRow row in dgvSalesOrders.Rows)
                {
                    if (row.Cells[2].Value.ToString().Equals(selected_order_no))
                    {
                        rowIndex = row.Index;
                        break;
                    }
                }

                if(rowIndex > -1)
                {
                    dgvSalesOrders.Rows[rowIndex].Selected = true;
                    this.DisplaySalesOrderItems();
                    this.CheckOrderSelection();
                }

            }
        }

        private void dgvSalesOrders_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            DataGridView dgv = sender as DataGridView;

            if (dgv == null)
            {
                return;
            }
            else
            {
                if(dgv.CurrentRow == null)
                {
                    return;
                }
                else
                {
                    if (dgv.CurrentRow.Selected)
                    {
                        selectedSalesOrderNo = dgv.SelectedCells[2].Value.ToString();
                        lblTotalDiscount.Text = selectedSalesOrderNo;


                        SystemApp.Instance.SelectedOrder = SalesOrders.Where(x => x.order_no == dgv.SelectedCells[2].Value.ToString()).First();

                        selectedOrderItemIndex = 0;
                        this.DisplaySalesOrderItems();
                        this.CheckOrderSelection();
                        this.ChangeItemSelectedToolbarStatus();

                        //check if selected order has an item with the name "MIX-N-MATCH"
                        //bool isMixMatch = SystemApp.Instance.SelectedOrder.order_items.Any(item => item.product.name == "MIX-N-MATCH");
                        bool isMixMatch = SystemApp.Instance.SelectedOrder.order_items.Any(item => item.product.name.Contains("MIX-N-MATCH"));
                        bool isMixMatchRemarks = SystemApp.Instance.SelectedOrder.order_items.Any(item => !string.IsNullOrEmpty(item.remarks));

                        if (isMixMatch)
                        {
                            if (isMixMatchRemarks)
                            {
                                btnPayment.Enabled = true;
                            }
                            else
                            {
                                btnPayment.Enabled = false;
                            }

                        }
                        else
                        {
                            btnPayment.Enabled = true;
                        }
                    }
                }
            }


        }


        private void btnPayment_Click(object sender, EventArgs e)
        {
            isPaymentFormOpen = true;

            //show payment form
            frmPayment form_payment = new frmPayment(this);

            form_payment.ShowDialog();


        }

        private void btnChangeQty_Click(object sender, EventArgs e)
        {
            //show change quantity form
            frmChangeQty form_changeqty = new frmChangeQty(this);

            form_changeqty.ShowDialog();
        }

        async private void btnRemoveItem_Click(object sender, EventArgs e)
        {
            //check items count
            //if = 1 item , suggest to cancel the order
            //if > 1 items, ask for confirmation before removing

            //checked the items of the selected order

            if(SystemApp.Instance.SelectedOrder.order_items.Count <= 1)
            {
                MessageBox.Show("Not Allowed. Please use the cancel for this action.");
            }else
            {
                //ask for a confirmation if you want to cancel an order
                DialogResult dr = MessageBox.Show("Are you sure to remove the selected item?", "Confirm Remove Item", MessageBoxButtons.YesNo, MessageBoxIcon.Information);

                if (dr == DialogResult.Yes)
                {

                    //Console.WriteLine(SystemApp.Instance.SelectedOrderItem.id);
                    // what the index of the selected order item?
                    //selectedOrderItemId
                    //SystemApp.Instance.SelectedOrder.order_items.RemoveAt(selectedOrderItemIndex - 1);

      /*              var result = await SystemApp.Instance.API_BASE
                              .AppendPathSegment("sales/sales_order_items/remove_item/" + SystemApp.Instance.SelectedOrderItem.id)
                              .PostJsonAsync(new { });*/
                        await req.SendPOSTRequest("sales/sales_order_items/remove_item/" + SystemApp.Instance.SelectedOrderItem.id,new { });

                    // Check Order so that data can be refresh
                    this.TickTimer();

                    //this.CheckNewSalesOrder();
                    //this.CheckOrderSelection();
                }
                else{
                    // do nothing
                }
            }


        }

        private void btnChangePrice_Click(object sender, EventArgs e)
        {
            //show change price form
            frmChangePrice form_changeprice = new frmChangePrice(this);

            form_changeprice.ShowDialog();
        }

        private void BtnDiscount_Click(object sender, EventArgs e)
        {
            //show discount form
            frmDiscount form_discount = new frmDiscount(this);

            form_discount.ShowDialog();
        }

        async private void btnCancelOrder_Click(object sender, EventArgs e)
        {
            //ask for a confirmation if you want to cancel an order
            DialogResult dr = MessageBox.Show("Are you sure to cancel the selected order?", "Confirm Cancel Order", MessageBoxButtons.YesNo, MessageBoxIcon.Information);

            if (dr == DialogResult.Yes)
            {
                // uopdate the order status to "cancelled"
                // re query api endpoint
              /*  var result = await SystemApp.Instance.API_BASE
                              .AppendPathSegment("sales/sales_orders/update_status")
                              .PostJsonAsync(new { status = "cancelled", order_no = SystemApp.Instance.SelectedOrder.order_no });*/

                await req.SendPOSTRequest("sales/sales_orders/update_status"
                              ,new { status = "cancelled", order_no = SystemApp.Instance.SelectedOrder.order_no });

                //clear the selection because we cancel the previously selected order
                selectedSalesOrderNo = null;
                SystemApp.Instance.SelectedOrder = new SalesOrder();

                // select the first row of the grid

                this.TickTimer();
                //this.CheckNewSalesOrder();

                total_items = 0;
                total_amount_due = 0;
                total_discount = 0;

                this.CalculateSelectedOrderTotals();
            }
            else
            {
                // do nothing
            }


        }





        public void ProcessChangeQuantity(int new_quantity)
        {
            //SystemApp.Instance.SelectedOrder.order_items[selectedOrderItemIndex - 1].quantity = new_quantity;
            //change this and make the changes to the database
            //this.RenderSalesOrderList();
        }

        public void ProcessChangePrice(decimal new_price)
        {
            SystemApp.Instance.SelectedOrder.order_items[selectedOrderItemIndex - 1].sale_price = new_price;
            this.RenderSalesOrderList();
        }

        public void ProcessDiscount(string type,float value)
        {



            SystemApp.Instance.SelectedOrderTotal.discount_type = type;
            SystemApp.Instance.SelectedOrderTotal.discount = value;

            // calculate discount
            //decimal total_discount;

            switch (type)
            {
                case "percentage":
                    decimal perc = (decimal)value / 100;
                    SystemApp.Instance.SelectedOrderTotal.total_discount = SystemApp.Instance.SelectedOrderTotal.total_amount_due * perc;
                    break;

                case "amount":
                    SystemApp.Instance.SelectedOrderTotal.total_discount = (decimal)value;
                    break;

                default:
                    break;
            }

            total_discount = SystemApp.Instance.SelectedOrderTotal.total_discount;
            this.CalculateSelectedOrderTotals();
            //this.DisplaySalesOrderItems();


            //Console.WriteLine(type);
            //Console.WriteLine(value);
        }

        private void ChangeItemSelectedToolbarStatus()
        {
            if (selectedOrderItemIndex > 0)
            {
                btnChangeQty.Enabled = true;
                btnRemoveItem.Enabled = true;
                btnChangePrice.Enabled = true;
            }
            else
            {
                btnChangeQty.Enabled = false;
                btnRemoveItem.Enabled = false;
                btnChangePrice.Enabled = false;
            }


        }



        private void btnRefreshData_Click(object sender, EventArgs e)
        {

        }

        private void btnClosing_Click(object sender, EventArgs e)
        {
            frmDailyClosing frmClosing = new frmDailyClosing(this);
            frmClosing.ShowDialog();
        }

        private void btnShipment_Click(object sender, EventArgs e)
        {
            frmShipment frmShipment = new frmShipment(this);
            frmShipment.ShowDialog();
        }

        private void btnSalesType_Click(object sender, EventArgs e)
        {
            frmSalesType frmSalesType = new frmSalesType(this);
            frmSalesType.ShowDialog();
        }

        public void DisableActionsWhenDayClosed()
        {
            this.panelOrderToolbar.Enabled = false;
            dgvSalesOrders.Enabled = false;
            dgvSalesOrderItems.Enabled = false;
        }

        private void dgvSalesOrderItems_CellClick(object sender, DataGridViewCellEventArgs e)
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

                if (dgv.CurrentRow.Selected)
                {
                    selectedOrderItemIndex = int.Parse(dgv.SelectedCells[0].Value.ToString());

                    SalesOrderItem salesOrderItem = new SalesOrderItem
                    {
                        id = int.Parse(dgv.SelectedCells[10].Value.ToString()),
                        product_id = dgv.SelectedCells[8].Value.ToString(),
                        order_no = dgv.SelectedCells[9].Value.ToString(),
                        quantity = int.Parse(dgv.SelectedCells[4].Value.ToString()),
                        sale_price = decimal.Parse(dgv.SelectedCells[6].Value.ToString())
                    };

                    SystemApp.Instance.SelectedOrderItem = salesOrderItem;
                    this.ChangeItemSelectedToolbarStatus();
                }
            }

        }

        private void dgvSalesOrderItems_CellContentDoubleClick(object sender, DataGridViewCellEventArgs e)
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
                    if (dgv.CurrentRow.Selected)
                    {
                        selectedOrderItemIndex = int.Parse(dgv.SelectedCells[0].Value.ToString());

                        if (dgv.SelectedCells[2].Value.ToString().Contains("MIX-N-MATCH"))
                        {
                            frmMixMatch form_mixmatch = new frmMixMatch(this);
                            form_mixmatch.ShowDialog();
                        }
                    }
                }
            }


        }

        private void dtOrderDate_ValueChanged(object sender, EventArgs e)
        {
            //this.TickTimer();
            this.CheckNewSalesOrder();
            this.CheckOrderSelection();
        }

        private void btnChangeDate_Click(object sender, EventArgs e)
        {
            dtOrderDate.Select();
            SendKeys.Send("%{DOWN}");
        }

        private void btnManualRefresh_Click(object sender, EventArgs e)
        {
            //Console.WriteLine("refresh data");
            //this.TickTimer();
            this.CheckNewSalesOrder();
            this.CheckOrderSelection();
        }

        private void btnStopRefresh_Click(object sender, EventArgs e)
        {
            if(btnStopRefresh.Text == "STOP REFRESH")
            {
                btnStopRefresh.Text = "START REFRESH";
                btnStopRefresh.BackColor = Color.SpringGreen;
                isStopRefresh = true;
                lblDataRefreshNote.Visible = true;
            }
            else
            {
                btnStopRefresh.Text = "STOP REFRESH";
                btnStopRefresh.BackColor = Color.OrangeRed;
                isStopRefresh = false;
                lblDataRefreshNote.Visible = false;
            }
        }
    }
}
