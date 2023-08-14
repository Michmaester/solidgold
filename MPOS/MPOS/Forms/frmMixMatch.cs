using Flurl;
using Flurl.Http;
using MPOS.Classes;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MPOS.Forms
{
    public partial class frmMixMatch : Form
    {
        private RequestHandler req = new RequestHandler();
        private frmOrders parentForm;

        public frmMixMatch(frmOrders form)
        {
            parentForm = form;
            InitializeComponent();
        }

        private void frmMixMatch_Load(object sender, EventArgs e)
        {
            this.ActiveControl = txtAddPrice;
        }

        private void btnEnter_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(txtAddPrice.Text))
            {
                return;
            }

            if (string.IsNullOrEmpty(txtRemarks.Text))
            {
                return;
            }

            this.UpdateMixMatch();


            //if (SystemApp.Instance.CheckPasscode(txtPassCode.Text))
            //{
            //    //parentForm.ProcessChangeQuantity(int.Parse(txtNewQuantity.Text));
            //    this.ChangeQuantity();
            //}
            //else
            //{
            //    MessageBox.Show("Incorrect Passcode.");
            //}
        }

        private void frmMixMatch_KeyDown(object sender, KeyEventArgs e)
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

        async private void UpdateMixMatch()
        {
            /*var result = await SystemApp.Instance.API_BASE
                              .AppendPathSegment("sales/sales_order_items/update_mixnmatch/" + SystemApp.Instance.SelectedOrderItem.id)
                              .PostJsonAsync(new { additional_price = txtAddPrice.Text, remarks = txtRemarks.Text });*/

            await req.SendPOSTRequest("sales/sales_order_items/update_mixnmatch/" + SystemApp.Instance.SelectedOrderItem.id,
                           new { additional_price = txtAddPrice.Text, remarks = txtRemarks.Text });

            parentForm.CheckNewSalesOrder();
            this.Close();
        }


    }
}
