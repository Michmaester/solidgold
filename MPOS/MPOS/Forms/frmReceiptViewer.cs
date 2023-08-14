using Microsoft.Reporting.WinForms;
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
using MPOS.Models;
using System.Collections;
using System.Drawing.Printing;

namespace MPOS.Forms
{
    public partial class frmReceiptViewer : Form
    {
        private RequestHandler req = new RequestHandler();
        private frmInvoiceDetails parentForm;

        public frmReceiptViewer(frmInvoiceDetails form)
        {
            parentForm = form;
            InitializeComponent();
        }

        private void frmReceiptViewer_Load(object sender, EventArgs e)
        {
            string reportTplLocation = null;

            this.rvReport.RefreshReport();



            //reportTplLocation = AppDomain.CurrentDomain.BaseDirectory + "/Reports/Test.rdlc";



            //testing check paper size

            if (SystemApp.Instance.SelectedInvoice.invoice_print_type == "trust_receipt")
            {
                // use the 1/2 report // trust receipt
                reportTplLocation = AppDomain.CurrentDomain.BaseDirectory + "/Reports/TrustReceipt.rdlc";
            }
            else
            {
                // use the 1/4 paper // invoice receipt
                // added 20210504 to support big print
                if (SystemApp.Instance.isBigPrint)
                {
                    reportTplLocation = AppDomain.CurrentDomain.BaseDirectory + "/Reports/BigPrint.rdlc";
                }
                else
                {
                    reportTplLocation = AppDomain.CurrentDomain.BaseDirectory + "/Reports/InvoiceReceipt.rdlc";
                }
                
            }

            rvReport.LocalReport.ReportPath = reportTplLocation;




            List<Invoice> invoices = new List<Invoice>();
            List<InvoiceItem> invoice_items = new List<InvoiceItem>();


            foreach (SalesTransactionItem item in SystemApp.Instance.SelectedInvoice.trans_items)
            {
                InvoiceItem invoice = new InvoiceItem();

                invoice.product_id = item.product_id;
                invoice.product_name = item.product.name;
                invoice.product_code = item.product.product_code;
                invoice.product_description = item.product.description;
                invoice.brand = item.product.brand.brandname;
                invoice.item_unit = item.product.unit.item_unit;

                invoice.qty = int.Parse(item.qty);
                invoice.delivery_qty = item.delivery_qty;
                invoice.price_per_unit = item.price_per_unit;
                invoice.unit = item.unit;
                invoice.discounted_amount = item.discounted_amount;
                invoice.total_amount = item.total_amount;

                invoice_items.Add(invoice);
            }



            for (int i = 0; i < 1; i++)
            {
                //manipulate
                Invoice inv = new Invoice();


                inv.transaction_date = SystemApp.Instance.SelectedInvoice.transaction_date.ToString("MMM-d-yyyy HH:mm tt");
                inv.transaction_type = SystemApp.Instance.SelectedInvoice.transaction_type;
                inv.invoice_no = SystemApp.Instance.SelectedInvoice.invoice_no;

                if (SystemApp.Instance.SelectedInvoice.customer.name.ToLower() == "cash")
                {
                    inv.customer = SystemApp.Instance.SelectedInvoice.cash_remark;
                }else
                {
                    inv.customer = SystemApp.Instance.SelectedInvoice.customer.name;
                }

                inv.total_amount_due = SystemApp.Instance.SelectedInvoice.total_amount_due.ToString();
                inv.total_amount_tendered = SystemApp.Instance.SelectedInvoice.total_amount_tendered.ToString();
                inv.balance_amount = SystemApp.Instance.SelectedInvoice.balance_amount.ToString();
                inv.change_amount = SystemApp.Instance.SelectedInvoice.change_amount.ToString();
                inv.total_discounted_amount = SystemApp.Instance.SelectedInvoice.total_discounted_amount.ToString();
                inv.status = SystemApp.Instance.SelectedInvoice.status;
                inv.payment_status = SystemApp.Instance.SelectedInvoice.payment_status;
                inv.branch_code = SystemApp.Instance.SelectedInvoice.branch_code;
                inv.salesman = SystemApp.Instance.SelectedInvoice.salesfront.fullname;

                if (SystemApp.Instance.SelectedInvoice.delivery != null)
                {
                    //Console.WriteLine("not null");
                    inv.delivery_requested_date = SystemApp.Instance.SelectedInvoice.delivery.delivery_requested_date;
                    inv.delivery_fee = SystemApp.Instance.SelectedInvoice.delivery.delivery_fee;
                    inv.delivery_notes = SystemApp.Instance.SelectedInvoice.delivery.delivery_notes ;
                }
                else
                {
                    //Console.WriteLine("its null");
                    inv.delivery_requested_date = null;
                    inv.delivery_fee = null;
                    inv.delivery_notes = null;
                }

                invoices.Add(inv);
            }

            rvReport.LocalReport.DataSources.Clear();

            ReportDataSource rds = new ReportDataSource("InvoiceItemDS", invoice_items);
            rvReport.LocalReport.DataSources.Add(rds);

            ReportDataSource invoiceds = new ReportDataSource("InvoiceDS", invoices);
            rvReport.LocalReport.DataSources.Add(invoiceds);


            // set the page margins
            PageSettings newPageSettings = new PageSettings();
            string[] margins = Properties.Settings.Default.MARGIN_LEFT_RIGHT_TOP_BOTTOM.Split(',');
            newPageSettings.Margins = new Margins(int.Parse(margins[0]), int.Parse(margins[1]), int.Parse(margins[2]), int.Parse(margins[3]));
            rvReport.SetPageSettings(newPageSettings);


            //  Check if auto print is enabled on the settings config
            if (Properties.Settings.Default.AUTO_PRINT == 1)
            {
                rvReport.LocalReport.PrintToPrinter();
                this.Close();
            }
            else
            {
                rvReport.LocalReport.Refresh();
                rvReport.RefreshReport();
            }

        }

        private void frmReceiptViewer_FormClosing(object sender, FormClosingEventArgs e)
        {
            //trigger also closing to parentform
            if (parentForm is frmInvoiceDetails)
            {
                parentForm.TriggerFormClose();
            }
            
        }
    }
}
