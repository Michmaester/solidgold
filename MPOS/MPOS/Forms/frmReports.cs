using Flurl;
using Flurl.Http;
using Microsoft.Reporting.WinForms;
using MPOS.Classes;
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

namespace MPOS.Forms
{
    public partial class frmReports : Form
    {

        Results SalesOrderResults;
        private RequestHandler req = new RequestHandler();
        public frmReports()
        {
            InitializeComponent();
        }

        private void frmReports_Load(object sender, EventArgs e)
        {
            
            this.rvReport.RefreshReport();

            dtDateFrom.Value = DateTime.Now;
            dtDateTo.Value = DateTime.Now;

            cbModule.SelectedIndex = 0;
            cbReportType.SelectedIndex = 0;
            this.rvReport.RefreshReport();
            this.rvReport.RefreshReport();
        }

        async private void btnGenerate_Click(object sender, EventArgs e)
        {
            switch (cbReportType.Text)
            {
                case "Summary Report":
                    this.GenerateReportSummaryReport();
                    break;

                case "Daily Transaction Report":
                    this.GenerateDailyTransactionReport();
                    break;

                case "Detailed Report":
                    //Console.WriteLine("detailed report");
                    this.GenerateReportDetailedReport();
                    break;

                case "Charge Transactions":
                    //Console.WriteLine("charge transactins");
                    this.GenerateReportChargeTransactionsReport();
                    break;

                default:
                    break;
            }
        }


        //Summary Report
        //Detailed Report
        //Charge Transactions

        async private void GenerateReportSummaryReport()
        {
            // Get Sales Order
            var status = "submitted";
      /*      SalesOrderResults = await SystemApp.Instance.API_BASE
                              .AppendPathSegment("sales/sales_orders/status/" + status)
                              .GetJsonAsync<Results>();*/

            SalesOrderResults = await req.SendGETRequest<Results>("sales/sales_orders/status/" + status, null);

            rvReport.LocalReport.ReportPath = AppDomain.CurrentDomain.BaseDirectory + "/Reports/SummaryReport.rdlc";

            ReportDataSource rds = new ReportDataSource("SalesSummaryDS", SalesOrderResults.data);
            rvReport.LocalReport.DataSources.Clear();
            rvReport.LocalReport.DataSources.Add(rds);
            rvReport.LocalReport.Refresh();
            rvReport.RefreshReport();
        }

        async private void GenerateDailyTransactionReport()
        {

            try
            {
                if ((dtDateFrom.Value.ToString("yyyy-MM-dd") == DateTime.Now.ToString("yyyy-MM-dd")) && SystemApp.Instance.isDayClosed == false)
                {
                    MessageBox.Show("Day Closing not yet performed for this Date");
                    return;
                }

           /*     DailyTransactionResult daily_tran = await SystemApp.Instance.API_BASE
                             .AppendPathSegment("/cashier/daily_transactions/" + dtDateFrom.Value.ToString("yyyy-MM-dd") + "/branch/" + SystemApp.Instance.SelectedBranch.branch_code)
                             .GetJsonAsync<DailyTransactionResult>();*/

                DailyTransactionResult daily_tran = await req.SendGETRequest<DailyTransactionResult>("/cashier/daily_transactions/" + dtDateFrom.Value.ToString("yyyy-MM-dd") + "/branch/" + SystemApp.Instance.SelectedBranch.branch_code, null);
                if (daily_tran.data.closing_datetime == null)
                {
                    MessageBox.Show("Day Closing not yet performed for this Date");
                    return;
                }
                DailyClosing DailyClosing = daily_tran.data;
                List<ClosingItem> ClosingItems = daily_tran.data.closing_items;

                rvReport.LocalReport.ReportPath = AppDomain.CurrentDomain.BaseDirectory + "/Reports/DailyClosing1.rdlc";

                rvReport.LocalReport.DataSources.Clear();

                ReportParameter pBranch = new ReportParameter("pBranch");
                ReportParameter pInitialCashAmount = new ReportParameter("pInitialCashAmount");
                ReportParameter pTransactionDate = new ReportParameter("pTransactionDate");
                ReportParameter pOpeningDateTime = new ReportParameter("pOpeningDateTime");
                ReportParameter pClosingDateTime = new ReportParameter("pClosingDateTime");
                ReportParameter pTotalSalesCollection = new ReportParameter("pTotalSalesCollection");
                ReportParameter pTotalNetAccountability = new ReportParameter("pTotalNetAccountability");
                ReportParameter pShortOverAmount = new ReportParameter("pShortOverAmount");
                ReportParameter pDailyTotalExpense = new ReportParameter("pDailyTotalExpense");

                pBranch.Values.Add(SystemApp.Instance.SelectedBranch.name.ToString());
                pTransactionDate.Values.Add(Convert.ToDateTime(DailyClosing.transaction_date).ToString("MMMM-dd-yyyy HH:mm:ss"));

                pInitialCashAmount.Values.Add(Convert.ToDecimal(DailyClosing.initial_cash_amount).ToString("#,##0.00"));
                
                pOpeningDateTime.Values.Add(Convert.ToDateTime(DailyClosing.opening_datetime).ToString("MMMM-dd-yyyy HH:mm:ss"));
                pClosingDateTime.Values.Add(Convert.ToDateTime(DailyClosing.closing_datetime).ToString("MMMM-dd-yyyy HH:mm:ss"));

                pTotalSalesCollection.Values.Add(Convert.ToDecimal(DailyClosing.total_sales_collection).ToString("#,##0.00"));
                pTotalNetAccountability.Values.Add(Convert.ToDecimal(DailyClosing.total_net_accountability).ToString("#,##0.00"));
                pShortOverAmount.Values.Add(Convert.ToDecimal(DailyClosing.short_over_amount).ToString("#,##0.00"));
                pDailyTotalExpense.Values.Add(Convert.ToDecimal(DailyClosing.daily_total_expense).ToString("#,##0.00"));

                rvReport.LocalReport.SetParameters(pBranch);
                rvReport.LocalReport.SetParameters(pInitialCashAmount);
                rvReport.LocalReport.SetParameters(pTransactionDate);
                rvReport.LocalReport.SetParameters(pOpeningDateTime);
                rvReport.LocalReport.SetParameters(pClosingDateTime);
                rvReport.LocalReport.SetParameters(pTotalSalesCollection);
                rvReport.LocalReport.SetParameters(pTotalNetAccountability);
                rvReport.LocalReport.SetParameters(pShortOverAmount);
                rvReport.LocalReport.SetParameters(pDailyTotalExpense);

                rvReport.LocalReport.DataSources.Add(new ReportDataSource("ClosingItemsDS", ClosingItems));

                rvReport.LocalReport.Refresh();
                rvReport.RefreshReport();
            }
            catch (Exception)
            {

                throw;
            }

        }

        async private void GenerateReportDetailedReport()
        {
            //// Get Sales Order
            //var status = "submitted";
            //SalesOrderResults = await SystemApp.Instance.API_BASE
            //                  .AppendPathSegment("sales/sales_orders/status/" + status)
            //                  .GetJsonAsync<Results>();

            rvReport.LocalReport.ReportPath = AppDomain.CurrentDomain.BaseDirectory + "/Reports/DetailedReport.rdlc";

            //ReportDataSource rds = new ReportDataSource("SalesSummaryDS", SalesOrderResults.data);
            //rvReport.LocalReport.DataSources.Clear();
            //rvReport.LocalReport.DataSources.Add(rds);
            rvReport.LocalReport.Refresh();
            rvReport.RefreshReport();
        }

        async private void GenerateReportChargeTransactionsReport()
        {
            // Get Sales Order
            //var status = "submitted";
            //SalesOrderResults = await SystemApp.Instance.API_BASE
            //                  .AppendPathSegment("sales/sales_orders/status/" + status)
            //                  .GetJsonAsync<Results>();

            rvReport.LocalReport.ReportPath = AppDomain.CurrentDomain.BaseDirectory + "/Reports/ChargeTransactions.rdlc";

            //ReportDataSource rds = new ReportDataSource("SalesSummaryDS", SalesOrderResults.data);
            //rvReport.LocalReport.DataSources.Clear();
            //rvReport.LocalReport.DataSources.Add(rds);
            rvReport.LocalReport.Refresh();
            rvReport.RefreshReport();
        }

        private void panel1_Paint(object sender, PaintEventArgs e)
        {

        }
    }
}
