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
    public partial class frmPrintType : Form
    {
        private RequestHandler req = new RequestHandler();
        public frmPrintType()
        {
            InitializeComponent();
        }

        private void btnDefaultPrintType_Click(object sender, EventArgs e)
        {
            SystemApp.Instance.isBigPrint = false;

            frmReceiptViewer form_receiptviewer = new frmReceiptViewer(null);
            form_receiptviewer.ShowDialog();

            this.Close();

        }

        private void btnBigPrint_Click(object sender, EventArgs e)
        {
            SystemApp.Instance.isBigPrint = true;

            frmReceiptViewer form_receiptviewer = new frmReceiptViewer(null);
            form_receiptviewer.ShowDialog();

            this.Close();
        }

        private void frmPrintType_Load(object sender, EventArgs e)
        {
            SystemApp.Instance.isBigPrint = false;
        }
    }
}
