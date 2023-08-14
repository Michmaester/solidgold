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
    public partial class frmChangeQty : Form
    {

        private frmOrders parentForm;
        private RequestHandler req = new RequestHandler();
        public frmChangeQty(frmOrders form)
        {
            parentForm = form;

            InitializeComponent();
        }

        private void btnEnter_Click(object sender, EventArgs e)
        {

            if (string.IsNullOrEmpty(txtNewQuantity.Text))
            {
                return;
            }


            if (SystemApp.Instance.CheckPasscode(txtPassCode.Text))
            {
                //parentForm.ProcessChangeQuantity(int.Parse(txtNewQuantity.Text));
                this.ChangeQuantity();
            }
            else
            {
                MessageBox.Show("Incorrect Passcode.");
            }

        }

        private void frmChangeQty_KeyDown(object sender, KeyEventArgs e)
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

        private void frmChangeQty_Load(object sender, EventArgs e)
        {
            txtQuantity.Text = SystemApp.Instance.SelectedOrderItem.quantity.ToString();
        }

        async private void ChangeQuantity()
        {
            var result = await SystemApp.Instance.API_BASE
                              .AppendPathSegment("sales/sales_order_items/update_quantity/" + SystemApp.Instance.SelectedOrderItem.id)
                              .PostJsonAsync(new { quantity = txtNewQuantity.Text });

            parentForm.CheckNewSalesOrder();
            this.Close();
        }
    }
}
