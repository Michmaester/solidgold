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

namespace MPOS.Forms
{
    public partial class frmChangePrice : Form
    {

        private frmOrders parentForm;
        private RequestHandler req = new RequestHandler();
        public frmChangePrice(frmOrders form)
        {
            parentForm = form;

            InitializeComponent();
        }

        private void btnEnter_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(txtNewPrice.Text))
            {
                return;
            }


            if (SystemApp.Instance.CheckPasscode(txtPassCode.Text))
            {
                this.ChangePrice();
            }
            else
            {
                MessageBox.Show("Incorrect Passcode.");
            }

        }

        private void frmChangePrice_KeyDown(object sender, KeyEventArgs e)
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

        private void frmChangePrice_Load(object sender, EventArgs e)
        {
            txtPrice.Text = SystemApp.Instance.SelectedOrderItem.sale_price.ToString("#,##0.00");
        }

        async private void ChangePrice()
        {
         /*   var result = await SystemApp.Instance.API_BASE
                              .AppendPathSegment("sales/sales_order_items/update_sale_price/" + SystemApp.Instance.SelectedOrderItem.id)
                              .PostJsonAsync(new { sale_price = txtNewPrice.Text });*/
            var payload = new { sale_price = txtNewPrice.Text };
            await req.SendPOSTRequest("sales/sales_order_items/update_sale_price/" + SystemApp.Instance.SelectedOrderItem.id, payload);


            parentForm.CheckNewSalesOrder();
            this.Close();
        }
    }
}
