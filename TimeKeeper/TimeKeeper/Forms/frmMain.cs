using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Data.SqlClient;
using MecsTimeKeeper.Services;
using MecsTimeKeeper.Models;
using MecsTimeKeeper.Controls;
using System.IO;
using MecsTimeKeeper.Helpers;
using MecsTimeKeeper.Classes;

namespace MecsTimeKeeper.Forms
{
    public partial class frmMain : Form
    {
        //FingerPrintControl fingerPrintControl = null;

        EmployeeService sEmployee = new EmployeeService();
        //BiometricInfoService sBiometricInfo = new BiometricInfoService();
        //TimeKeepingInfoService sTimeKeepingInfo = new TimeKeepingInfoService();
        DailyTimeRecordService sDailyTimeRecord = new DailyTimeRecordService();
        DailyTimeLogService sDailyTimeLog = new DailyTimeLogService();


        FingerPrintControl fingerPrintControl = new FingerPrintControl();



        public frmMain()
        {
            InitializeComponent();

            this.picCompanyLogo.Image = new Bitmap(AppDomain.CurrentDomain.BaseDirectory + "\\assets\\clogo.png");

            pnlStage.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;

            //LoadFingerprintControl();

            //check if admin login
            AuthenticationCheck();
        }

        private void LoadFingerprintControl()
        {
            
            fingerPrintControl.parentForm = this;
            fingerPrintControl.Dock = DockStyle.Fill;
            pnlStage.Controls.Add(fingerPrintControl);

            fingerPrintControl.InitDevice();
        }


        

        private void tmrSysTimer_Tick(object sender, EventArgs e)
        {
            lblSysDate.Text = DateTime.Now.ToString("MMMM dd, yyyy");
            lblSysTime.Text = DateTime.Now.ToString("hh:mm:ss tt");
        }

        private void frmMain_Load(object sender, EventArgs e)
        {

            IEnumerable<Employee> employees = sEmployee.GetEmployees();
            foreach (Employee item in employees)
            {
                Console.WriteLine(item.first_name);
            }

            //Console.WriteLine(test);
            tmrSysTimer.Start();
        }

        private void frmMain_FormClosing(object sender, FormClosingEventArgs e)
        {

            DialogResult dr = MessageBox.Show("Are you sure to exit this application?", "Confirm Exit", MessageBoxButtons.YesNo, MessageBoxIcon.Information);

            if (dr == DialogResult.Yes)
            {

                tmrSysTimer.Stop();

                base.OnClosing(e);

                try
                {
                    if (fingerPrintControl != null)
                    {
                        if (fingerPrintControl.cmbIdx.Items.Count > 0)
                            fingerPrintControl.OnDisconnect();
                    }
                }
                catch
                { }
            }
            else
            {
                // do nothing as shit.
            }

            
        }

    

        public void EmployeeScannedSuccessfully(int emp_id)
        {

            System.Media.SoundPlayer player = new System.Media.SoundPlayer(AppDomain.CurrentDomain.BaseDirectory + "\\sounds\\correct.wav");
            player.Play();

            Employee employee = sEmployee.GetEmployee(emp_id);

            //visible the panel of the employee to dislay its name
            panelEmpDetail.Visible = true;

            lblEmpName.Text = employee.first_name + " " + employee.last_name;
            lblEmpId.Text = employee.id_no;

            // ---> disable the photo
            //if not null then display the photo
            //if (employee.PhotoData != null)
            //{
            //    MemoryStream ms = new MemoryStream(employee.PhotoData);
            //    Bitmap bmp = new Bitmap(ms);
            //    this.picEmp.Image = bmp;
            //}
            //else
            //{
            //    //display photo here
            //    this.picEmp.Image = new Bitmap(AppDomain.CurrentDomain.BaseDirectory + "\\assets\\dtr-no-photo.png");

            //}


            // get the daily time logs for today of the employee

            DailyTimeRecord dtr = sDailyTimeRecord.GetDailyTimeRecord(emp_id, DateTime.Now.ToString("yyyy-MM-dd"));

            //insert to daily time logs
            IEnumerable<DailyTimeLog> dtlogs = sDailyTimeLog.GetDailyTimeLogs(dtr.dtr_id);

            dgvDailyTimeLogs.Rows.Clear();
            foreach (DailyTimeLog dtlog in dtlogs)
            {


                string shiftname = null;
                switch (dtlog.shift_no)
                {
                    case 1:
                        shiftname = "Start - In";
                        break;

                    case 2:
                        shiftname = "Lunchbreak - Out";
                        break;

                    case 3:
                        shiftname = "LunchBreak - In";
                        break;

                    case 4:
                        shiftname = "Day - End - Out";
                        break;

                    default:
                        break;
                }

                DateTime dtlDatetime = Convert.ToDateTime(dtlog.dtl_datetime);

                dgvDailyTimeLogs.Rows.Add(
                    dtlDatetime.ToString("MMMM - dd - yyyy"),
                    dtlDatetime.ToString("hh:mm:ss tt"),
                    shiftname
                );
            }


        }

        public void EmployeeScannedFailed()
        {
            System.Media.SoundPlayer player = new System.Media.SoundPlayer(AppDomain.CurrentDomain.BaseDirectory + "\\sounds\\invalid.wav");
            player.Play();

            panelEmpDetail.Visible = false;
            lblEmpName.Text = null;
            dgvDailyTimeLogs.Rows.Clear();
        }

        public void UpdateFingerprintPicture(Bitmap bmp)
        {
            this.picFingerprint.Image = bmp;
        }



        

        public void AuthenticationCheck()
        {
            //check if admin login
            if (SystemApp.Instance.isAdmin)
            {
                pnlStage.Enabled = true;
            }
            else
            {
                pnlStage.Enabled = false;
            }


            foreach (var item in fingerPrintControl.Controls)
            {

                if (item is TabControl)
                {
                    TabControl tab = item as TabControl;
                    tab.SelectedIndex = 0;
                }

            }

        }

        private void picSysLogo_DoubleClick(object sender, EventArgs e)
        {
            frmLogin formLogin = new frmLogin(this);
            formLogin.ShowDialog();
        }







        private void button1_Click(object sender, EventArgs e)
        {
            frmBlocklist frmBlocklist = new frmBlocklist();
            frmBlocklist.ShowDialog();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            //generate dtr id
            string branch_code = Properties.Settings.Default.BranchCode;



            int res = sDailyTimeRecord.InsertDailyTimeRecord(
                    "sss",
                    123,
                    "2021-05-19 12:00:12",
                    branch_code,
                    0
                );
            if(res > 0)
            {
                MessageBox.Show("Suceesfully recorded");
            }
            else
            {
                MessageBox.Show("error recording");
            }
        }

        private void button3_Click(object sender, EventArgs e)
        {
            string branch_code = Properties.Settings.Default.BranchCode;

            int res = sDailyTimeLog.InsertDailyTimeLog(
                "12122",
                123,
                "2021-05-19 13:00:12",
                1,
                branch_code,
                0
                );

                 if (res > 0)
            {
                MessageBox.Show("Suceesfully recorded");
            }
            else
            {
                MessageBox.Show("error recording");
            }
        }

        private void button4_Click(object sender, EventArgs e)
        {
            string res = sDailyTimeRecord.GenerateDtrId(Properties.Settings.Default.BranchCode,12);
            MessageBox.Show(res);
        }
    }
}
