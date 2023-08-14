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

namespace MPOS.Forms
{

    public partial class frmDiscount : Form
    {
        private frmOrders parentForm;
        private RequestHandler req = new RequestHandler();
        private string type = null;

        public frmDiscount(frmOrders form)
        {
            parentForm = form;
            InitializeComponent();
        }

        private void frmDiscount_Load(object sender, EventArgs e)
        {

        }

        private void btnEnter_Click(object sender, EventArgs e)
        {
            if (!string.IsNullOrEmpty(txtPassCode.Text) && !string.IsNullOrEmpty(txtValue.Text))
            {
                if (rbPercentage.Checked)
                {
                    type = "percentage";
                }

                if (rbAmount.Checked)
                {
                    type = "amount";
                }

                parentForm.ProcessDiscount(type, float.Parse(txtValue.Text));
                this.Close();
            }
            else
            {
                MessageBox.Show("Missing Inputs!");
            }
        }

        private void frmDiscount_KeyDown(object sender, KeyEventArgs e)
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

        private void rbPercentage_CheckedChanged(object sender, EventArgs e)
        {

        }
    }
}
