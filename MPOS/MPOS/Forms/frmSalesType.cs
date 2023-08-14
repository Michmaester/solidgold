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
    public partial class frmSalesType : Form
    {
        private frmOrders parentForm;
        string sales_type = null;
        private RequestHandler req = new RequestHandler();
        public frmSalesType(frmOrders form)
        {
            parentForm = form;
            InitializeComponent();
        }

        private void frmSalesType_KeyDown(object sender, KeyEventArgs e)
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

        private void frmSalesType_Load(object sender, EventArgs e)
        {
            switch (SystemApp.Instance.SelectedOrder.sales_type)
            {
                case "Retail":
                    sales_type = "Retail";
                    rdbRetail.Checked = true;
                    break;

                case "Wholesale":
                    sales_type = "Wholesale";
                    rdbWholesale.Checked = true;
                    break;

                default:
                    break;
            }
        }

        private void rdbRetail_CheckedChanged(object sender, EventArgs e)
        {
            if (rdbRetail.Checked)
            {
                sales_type = "Retail";
            }
        }

        private void rdbWholesale_CheckedChanged(object sender, EventArgs e)
        {
            if (rdbWholesale.Checked)
            {
                sales_type = "Wholesale";
            }
        }

        async private void btnEnter_Click(object sender, EventArgs e)
        {

            // write on the api---------

            /* var result = await SystemApp.Instance.API_BASE
                               .AppendPathSegment("sales/sales_orders/update_salestype")
                               .PostJsonAsync(new { sales_type = sales_type, order_no = SystemApp.Instance.SelectedOrder.order_no });
 */
            await req.SendPOSTRequest("sales/sales_orders/update_salestype", new { sales_type = sales_type, order_no = SystemApp.Instance.SelectedOrder.order_no });


            parentForm.CheckNewSalesOrder();

            this.Close();
        }

        private void btnClose_Click(object sender, EventArgs e)
        {
            this.Close();
        }
    }
}
