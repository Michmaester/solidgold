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
    public partial class frmShipment : Form
    {
        private frmOrders parentForm;
        string shipment_type = null;
        private RequestHandler req = new RequestHandler();
        public frmShipment(frmOrders form)
        {
            parentForm = form;
            InitializeComponent();
        }

        private void frmShipment_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Escape)
            {
                this.Close();
            }

            if (e.KeyCode == Keys.Enter)
            {
                btnEnter.PerformClick();
            }
        }

        private void frmShipment_Load(object sender, EventArgs e)
        {

            switch (SystemApp.Instance.SelectedOrder.shipment)
            {
                case "Pickup":
                    shipment_type = "Pickup";
                    rdbPickup.Checked = true;
                    break;

                case "Delivery":
                    shipment_type = "Delivery";
                    rdbDelivery.Checked = true;
                    dtDeliveryRequestDate.Value = DateTime.Parse(SystemApp.Instance.SelectedOrder.delivery_request_date);

                    if (string.IsNullOrEmpty(SystemApp.Instance.SelectedOrder.delivery_fee.ToString()))
                    {
                        txtDeliveryFee.Text = 0.ToString("#,##0.00");
                    }
                    else
                    {
                        txtDeliveryFee.Text = SystemApp.Instance.SelectedOrder.delivery_fee.ToString();
                    }

                    if (string.IsNullOrEmpty(SystemApp.Instance.SelectedOrder.delivery_notes))
                    {
                        txtDeliveryNotes.Text = "n/a";
                    }
                    else
                    {
                        txtDeliveryNotes.Text = SystemApp.Instance.SelectedOrder.delivery_notes;
                    }

                    
                    break;

                default:
                    break;
            }
            
        }

       

        private void rdbPickup_CheckedChanged(object sender, EventArgs e)
        {
            if (rdbPickup.Checked)
            {
                shipment_type = "Pickup";
            }
        }

        private void rdbDelivery_CheckedChanged(object sender, EventArgs e)
        {
            if (rdbDelivery.Checked)
            {
                shipment_type = "Delivery";
                dtDeliveryRequestDate.Value = DateTime.Now;
                txtDeliveryFee.Text = 0.ToString("#,##0.00");
                txtDeliveryNotes.Text = "n/a";

                panelDeliveryForm.Enabled = true;
                this.ActiveControl = txtDeliveryFee;
            }else
            {
                panelDeliveryForm.Enabled = false;
            }
        }

        async private void btnEnter_Click(object sender, EventArgs e)
        {

            


            dynamic result;
            if(shipment_type == "Delivery")
            {
/*                result = await SystemApp.Instance.API_BASE
                              .AppendPathSegment("sales/sales_orders/update_shipment")
                              .PostJsonAsync(new {
                                  shipment = shipment_type,
                                  delivery_request_date = dtDeliveryRequestDate.Value.ToString("yyyy-MM-dd HH:mm:ss"),
                                  delivery_fee = txtDeliveryFee.Text,
                                  delivery_notes = txtDeliveryNotes.Text,
                                  order_no = SystemApp.Instance.SelectedOrder.order_no
                              });*/

                await req.SendPOSTRequest("sales/sales_orders/update_shipment",
                             new
                             {
                                 shipment = shipment_type,
                                 delivery_request_date = dtDeliveryRequestDate.Value.ToString("yyyy-MM-dd HH:mm:ss"),
                                 delivery_fee = txtDeliveryFee.Text,
                                 delivery_notes = txtDeliveryNotes.Text,
                                 order_no = SystemApp.Instance.SelectedOrder.order_no
                             });

                //check result status
                parentForm.CheckNewSalesOrder();
                this.Close();
            }
            else
            {
                await req.SendPOSTRequest("sales/sales_orders/update_shipment",
                              new
                              {
                                  shipment = shipment_type,
                                  order_no = SystemApp.Instance.SelectedOrder.order_no
                              });
                //check result status
                parentForm.CheckNewSalesOrder();
                this.Close();
            }

            
        }

        private void btnClose_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void panelDeliveryForm_Paint(object sender, PaintEventArgs e)
        {

        }
    }
}
