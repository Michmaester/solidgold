using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Threading;
using libzkfpcsharp;
using MecsTimeKeeper.Forms;
using MecsTimeKeeper.Helpers;
using System.Runtime.InteropServices;
using System.IO;
using MecsTimeKeeper.Services;
using MecsTimeKeeper.Models;

namespace MecsTimeKeeper.Controls
{
    public partial class FingerPrintControl : UserControl
    {

        EmployeeService sEmployee = new EmployeeService();
        BiometricInfoService sBiometricInfo = new BiometricInfoService();
        TimeKeepingInfoService sTimeKeepingInfo = new TimeKeepingInfoService();
        DailyTimeRecordService sDailyTimeRecord = new DailyTimeRecordService();
        DailyTimeLogService sDailyTimeLog = new DailyTimeLogService();
        FingerprintService sFingerService = new FingerprintService();

        BlocklistService sBlocklist = new BlocklistService();



        const string VerifyButtonDefault = "Verify";
        const string VerifyButtonToggle = "Stop Verification";
        const string Disconnected = "Disconnected";

        Thread captureThread = null;

        public frmMain parentForm = null;

        #region -------- FIELDS --------

        const int REGISTER_FINGER_COUNT = 3;

        zkfp fpInstance = new zkfp();
        IntPtr FormHandle = IntPtr.Zero; // To hold the handle of the form
        bool bIsTimeToDie = false;
        bool IsRegister = false;
        bool bIdentify = true;
        byte[] FPBuffer;   // Image Buffer
        int RegisterCount = 0;

        byte[][] RegTmps = new byte[REGISTER_FINGER_COUNT][];

        byte[] RegTmp = new byte[2048];
        byte[] CapTmp = new byte[2048];
        int cbCapTmp = 2048;
        int regTempLen = 0;
        int iFid = 1;

        int selEmpIdToEnroll = 0;
        int allowableScanningInterval = Properties.Settings.Default.AlowableScanningInterval;

        const int MESSAGE_CAPTURED_OK = 0x0400 + 6;




        private int mfpWidth = 0;
        private int mfpHeight = 0;


        #endregion

        public FingerPrintControl()
        {
            InitializeComponent();
            ReInitializeInstance();

            PopulateEmployees();
            
        }


        private void PopulateEmployees()
        {
            //IEnumerable<Employee> employees = sEmployee.GetEmployees();

            //foreach (Employee employee in employees)
            //{
            //    ComboboxItem item = new ComboboxItem();
            //    item.Text = employee.FirstName + " " + employee.LastName;
            //    item.Value = new SelectedEmployee { employee_id = employee.Id, timekeeping_id = employee.TimeKeepingInfo_Id  };

            //    cmbEmployeeList.Items.Add(item);
            //}
        }


        // [ INITALIZE DEVICE ]

        public void InitDevice()
        {
            parentForm.statusBar1.Visible = false;
            cmbIdx.Items.Clear();

            int initializeCallBackCode = fpInstance.Initialize();
            if (zkfp.ZKFP_ERR_OK == initializeCallBackCode)
            {
                int nCount = fpInstance.GetDeviceCount();
                if (nCount > 0)
                {
                    for (int i = 1; i <= nCount; i++) cmbIdx.Items.Add(i.ToString());

                    cmbIdx.SelectedIndex = 0;
                    btnInit.Enabled = false;

                    DisplayMessage(MessageManager.msg_FP_InitComplete, true);
                }
                else
                {
                    int finalizeCount = fpInstance.Finalize();
                    DisplayMessage(MessageManager.msg_FP_NotConnected, false);
                }




                // CONNECT DEVICE

                #region -------- CONNECT DEVICE --------

                int openDeviceCallBackCode = fpInstance.OpenDevice(cmbIdx.SelectedIndex);
                if (zkfp.ZKFP_ERR_OK != openDeviceCallBackCode)
                {
                    DisplayMessage($"Unable to connect with the device! (Return Code: {openDeviceCallBackCode} )", false);
                    return;
                }

                Utilities.EnableControls(false, btnInit);
                Utilities.EnableControls(true, btnClose, btnEnroll, btnVerify, btnIdentify, btnFree);

                RegisterCount = 0;
                regTempLen = 0;
                iFid = 1;

                //for (int i = 0; i < 3; i++)
                for (int i = 0; i < REGISTER_FINGER_COUNT; i++)
                {
                    RegTmps[i] = new byte[2048];
                }

                byte[] paramValue = new byte[4];
                int size = 4;

                //fpInstance.GetParameters

                fpInstance.GetParameters(1, paramValue, ref size);
                zkfp2.ByteArray2Int(paramValue, ref mfpWidth);

                size = 4;
                fpInstance.GetParameters(2, paramValue, ref size);
                zkfp2.ByteArray2Int(paramValue, ref mfpHeight);

                FPBuffer = new byte[mfpWidth * mfpHeight];

                //FPBuffer = new byte[fpInstance.imageWidth * fpInstance.imageHeight];

                captureThread = new Thread(new ThreadStart(DoCapture));
                captureThread.IsBackground = true;
                captureThread.Start();


                bIsTimeToDie = false;

                string devSN = fpInstance.devSn;
                lblDeviceStatus.Text = "Connected \nDevice S.No: " + devSN;

                DisplayMessage("You are now connected to the device.", true);


                // Get all fingers and load it to the device
                IEnumerable<BiometricInfo> bios = sBiometricInfo.GetBiometricInfos();

                foreach (BiometricInfo bio in bios)
                {
                    int fID = bio.Id;
                    byte[] regTemplate = bio.ImageData;
                    fpInstance.AddRegTemplate(fID, regTemplate);
                }

                Console.WriteLine("Templates loaded to device.");

                #endregion

            }
            else
                DisplayMessage("Unable to initailize the device. " + FingerPrintDeviceUtilities.DisplayDeviceErrorByCode(initializeCallBackCode) + " !! ", false);

        }

        private void btnInit_Click(object sender, EventArgs e)
        {
            InitDevice();
        }



        // [ CAPTURE FINGERPRINT ]
        private void DoCapture()
        {
            try
            {
                while (!bIsTimeToDie)
                {
                    cbCapTmp = 2048;
                    int ret = fpInstance.AcquireFingerprint(FPBuffer, CapTmp, ref cbCapTmp);

                    if (ret == zkfp.ZKFP_ERR_OK)
                    {
                        //if (RegisterCount == 0)
                        //    btnEnroll.Invoke((Action)delegate
                        //    {
                        //        btnEnroll.Enabled = true;
                        //    });
                        SendMessage(FormHandle, MESSAGE_CAPTURED_OK, IntPtr.Zero, IntPtr.Zero);
                    }
                    Thread.Sleep(100);
                }
            }
            catch { }

        }

        [DllImport("user32.dll", EntryPoint = "SendMessageA")]
        public static extern int SendMessage(IntPtr hwnd, int wMsg, IntPtr wParam, IntPtr lParam);


       
        private void btnIdentify_Click(object sender, EventArgs e)
        {
            if (!bIdentify)
            {
                bIdentify = true;
                DisplayMessage(MessageManager.msg_FP_PressForIdentification, true);
            }
        }

        private void btnVerify_Click(object sender, EventArgs e)
        {
            if (bIdentify)
            {
                bIdentify = false;
                btnVerify.Text = VerifyButtonToggle;
                DisplayMessage(MessageManager.msg_FP_PressForVerification, true);
            }
            else
            {
                bIdentify = true;
                btnVerify.Text = VerifyButtonDefault;
            }
        }


        protected override void DefWndProc(ref Message m)
        {
            switch (m.Msg)
            {
                case MESSAGE_CAPTURED_OK:
                    {
                        
                        parentForm.statusBar1.Visible = false;

                        if (IsRegister)
                        {
                            #region -------- IF REGISTERED FINGERPRINT --------

                            DisplayFingerPrintImageForEnrollment();

                            int ret = zkfp.ZKFP_ERR_OK;
                            int fid = 0, score = 0;
                            ret = fpInstance.Identify(CapTmp, ref fid, ref score);
                            if (zkfp.ZKFP_ERR_OK == ret)
                            {
                                int deleteCode = fpInstance.DelRegTemplate(fid);   // <---- REMOVE FINGERPRINT
                                if (deleteCode != zkfp.ZKFP_ERR_OK)
                                {
                                    DisplayEnrollmentMessage(MessageManager.msg_FP_CurrentFingerAlreadyRegistered + fid, false);
                                    return;
                                }
                            }
                            if (RegisterCount > 0 && fpInstance.Match(CapTmp, RegTmps[RegisterCount - 1]) <= 0)
                            {
                                DisplayEnrollmentMessage("Please press the same finger " + REGISTER_FINGER_COUNT + " times for enrollment", true);

                                return;
                            }
                            Array.Copy(CapTmp, RegTmps[RegisterCount], cbCapTmp);


                            if (RegisterCount == 0) btnEnroll.Enabled = false;

                            RegisterCount++;
                            if (RegisterCount >= REGISTER_FINGER_COUNT)
                            {

                                RegisterCount = 0;
                                ret = GenerateRegisteredFingerPrint();   // <--- GENERATE FINGERPRINT TEMPLATE

                                if (zkfp.ZKFP_ERR_OK == ret)
                                {

                                    
                                    
                                        string fingerPrintTemplate = string.Empty;
                                        zkfp.Blob2Base64String(RegTmp, regTempLen, ref fingerPrintTemplate);

                                        //Utilities.EnableControls(true, btnVerify, btnIdentify);
                                        Utilities.EnableControls(true, btnEnroll);


                                        // GET THE TEMPLATE HERE : fingerPrintTemplate

                                        //int insertRes = sFingerService.InsertFinger(selEmpIdToEnroll,zkfp.Base64String2Blob(fingerPrintTemplate));

                                        int insertRes = sBiometricInfo.InsertBiometricInfo(selEmpIdToEnroll, zkfp.Base64String2Blob(fingerPrintTemplate));
                                        if(insertRes == 1)
                                        {
                                                iFid = sBiometricInfo.GetLastBiometricInfoByEmp(selEmpIdToEnroll);

                                                //  <--- LOAD TEMPLATE TO MEMORY
                                                ret = AddTemplateToMemory();

                                                if (zkfp.ZKFP_ERR_OK == ret)  // <--- ENROLL SUCCESSFULL
                                                {
                                                    DisplayEnrollmentMessage(MessageManager.msg_FP_EnrollSuccessfull, true);


                                                    //enrollment button should be clear here
                                                    ClearImage();
                                                    IsRegister = false;
                                                    RegisterCount = 0;
                                                    regTempLen = 0;
                                                    selEmpIdToEnroll = 0;

                                                    enrollStatusBar.Visible = false;

                                                    cmbEmployeeList.SelectedIndex = -1;
                                                    cmbEmployeeList.Enabled = false;

                                                    DisconnectFingerPrintCounter();
                                                }
                                                else
                                                {
                                                    DisplayEnrollmentMessage(MessageManager.msg_FP_FailedToAddTemplate, false);
                                                }
                                                   
                                         }

                                }
                                else
                                    DisplayEnrollmentMessage(MessageManager.msg_FP_UnableToEnrollCurrentUser + ret, false);

                                IsRegister = false;
                                return;
                            }
                            else
                            {
                                int remainingCont = REGISTER_FINGER_COUNT - RegisterCount;
                                lblFingerPrintCount.Text = remainingCont.ToString();
                                string message = "Please provide your fingerprint " + remainingCont + " more time(s)";

                                DisplayEnrollmentMessage(message, true);

                            }
                            #endregion
                        }
                        else
                        {

                            #region ------- IF RANDOM FINGERPRINT -------

                            DisplayFingerPrintImage();

                            int ret = zkfp.ZKFP_ERR_OK;
                            int fid = 0, score = 0;
                            ret = fpInstance.Identify(CapTmp, ref fid, ref score);
                            if (zkfp.ZKFP_ERR_OK == ret)
                            {
                                DisplayMessage("Fingerprint identified succesfully.", true);
                                //Console.WriteLine("Match Successfull -> FID : " + fid + " -> Score : " + score);

                                // Process DTR
                                int emp_id = sBiometricInfo.GetEmployeeIdByFId(fid);

                                // check the emp_id if on th blocklist
                                // if not then generate dtr
                                if (sBlocklist.CheckIsEmployeeIfBlock(emp_id))
                                {
                                    //the employee is block
                                    DisplayMessage("Scanning block! Please contact management.", true);
                                }
                                else
                                {
                                    GenerateDTR(emp_id);

                                    this.parentForm.EmployeeScannedSuccessfully(emp_id);
                                    return;
                                }

                                
                            }
                            else
                            {
                                DisplayMessage("Cannot Identify fingerprint. Need to be enrolled.", false);
                                //Console.WriteLine("Match Failed -> Score : " + score);
                                this.parentForm.EmployeeScannedFailed();
                                return;
                            }
                           
                            #endregion
                        }

                    }
                    break;

                default:
                    base.DefWndProc(ref m);
                    break;
            }
        }



        private void GenerateDTR(int emp_id)
        {
            //check if have daily time record
            DailyTimeRecord dtr = sDailyTimeRecord.GetDailyTimeRecord(emp_id, DateTime.Now.ToString("yyyy-MM-dd"));


            if (dtr != null)
            {
                // if dtr exist then read the recent timelogs
                // check wether the time stamp is allowable
                // if allowed then insert time log

                int minute_diff = sDailyTimeLog.GetScanningDiffinMinutes(dtr.dtr_id, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));

                //check if positive value

                if(minute_diff > 0)
                {
                    //its positive
                    if(minute_diff == 0 || minute_diff < allowableScanningInterval)
                    {
                        //do not allow
                        int next_allow = allowableScanningInterval - minute_diff;
                        DisplayMessage("Duplicate scanning detected.Please try again in " + next_allow + " minute/s.", false);
                    }
                    else
                    {
                        //allow
                        DecideWhatShiftToInsert(dtr);
                        //sDailyTimeLog.InsertDailyTimeLog(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), int.Parse(dtr.Id), 1);
                    }
                }else
                {
                    //its negative then it should be allowed
                    if(minute_diff < 0)
                    {
                        DecideWhatShiftToInsert(dtr);
                        //sDailyTimeLog.InsertDailyTimeLog(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), int.Parse(dtr.Id), 1);
                    }
                    else
                    {
                        int next_allow = allowableScanningInterval - 0;
                        DisplayMessage("Duplicate scanning detected.Please try again in " + next_allow + " minute/s.", false);
                    }
                    
                }


            }
            else
            {
                // if dtr do not exist
                // create the dtr
                // create the time log

                //insert to daily time records
                //generate dtr_id here
                string branch_code = Properties.Settings.Default.BranchCode;
                string generatedDtrId = sDailyTimeRecord.GenerateDtrId(branch_code,emp_id);

                int res = sDailyTimeRecord.InsertDailyTimeRecord(generatedDtrId,emp_id,DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), branch_code, 0);
                if(res > 0)
                {
                    DailyTimeRecord newdtr = sDailyTimeRecord.GetDailyTimeRecord(emp_id, DateTime.Now.ToString("yyyy-MM-dd"));

                    //insert to daily time logs
                    //this is the first time log so it should be shift # 1
                    sDailyTimeLog.InsertDailyTimeLog(newdtr.dtr_id,emp_id,DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),1, branch_code, 0);
                }

                
            }
        }

        private void DecideWhatShiftToInsert(DailyTimeRecord dtr)
        {
            string branch_code = Properties.Settings.Default.BranchCode;
            //check the last log if what shift
            int shift_id = sDailyTimeLog.GetLastLogShift(dtr.dtr_id);

            if(shift_id < 4)
            {
                sDailyTimeLog.InsertDailyTimeLog(dtr.dtr_id,dtr.emp_id,DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), shift_id + 1,branch_code,0);
            }else
            {
                //error
                DisplayMessage("Shifts already complete. If WRONG. Please record your time and see Management.", false);
            }
        }



        /// <summary>
        /// FREE RESOURCES
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void btnFree_Click(object sender, EventArgs e)
        {
            int result = fpInstance.Finalize();

            if (result == zkfp.ZKFP_ERR_OK)
            {
                DisconnectFingerPrintCounter();
                IsRegister = false;
                RegisterCount = 0;
                regTempLen = 0;
                ClearImage();
                cmbIdx.Items.Clear();
                Utilities.EnableControls(true, btnInit);
                Utilities.EnableControls(false, btnFree, btnClose, btnEnroll, btnVerify, btnIdentify);

                DisplayMessage("Resources were successfully released from the memory !!", true);
            }
            else
                DisplayMessage("Failed to release the resources !!", false);
        }

        private void ClearImage()
        {
            picFPImg.Image = null;
        }

        private void btnEnroll_Click(object sender, EventArgs e)
        {
            if (!IsRegister)
            {
                //enable the comboox of employee list here and let the user select the employee
                enrollStatusBar.Visible = true;
                cmbEmployeeList.Enabled = true;

                DisplayEnrollmentMessage("Please select an employee to Enroll.", true);

                
            }
        }




        public object PushToDevice(object args)
        {
            DisplayMessage("Pushed to fingerprint !", true);
            return null;
        }


        public void ReEnrollUser(bool enableEnroll, bool clearDeviceUser = true)
        {
            ClearImage();
            if (clearDeviceUser && !btnInit.Enabled) ClearDeviceUser();
            if (enableEnroll) btnEnroll.Enabled = true;
        }


        public void ClearDeviceUser()
        {
            try
            {
                int deleteCode = fpInstance.DelRegTemplate(iFid);   // <---- REMOVE FINGERPRINT
                if (deleteCode != zkfp.ZKFP_ERR_OK)
                {
                    DisplayMessage(MessageManager.msg_FP_UnableToDeleteFingerPrint + iFid, false);
                }
                iFid = 1;
            }
            catch { }

        }


        public bool ReleaseResources()
        {
            try
            {
                ReEnrollUser(true, true);
                btnClose_Click(null, null);
                return true;
            }
            catch
            {
                return false;
            }

        }

        #region -------- CONNECT/DISCONNECT DEVICE --------



        /// <summary>
        /// DISCONNECT DEVICE
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void btnClose_Click(object sender, EventArgs e)
        {
            OnDisconnect();
        }


        public void OnDisconnect()
        {
            bIsTimeToDie = true;
            RegisterCount = 0;
            DisconnectFingerPrintCounter();
            ClearImage();
            Thread.Sleep(1000);
            int result = fpInstance.CloseDevice();

            captureThread.Abort();
            if (result == zkfp.ZKFP_ERR_OK)
            {
                Utilities.EnableControls(false, btnInit, btnClose, btnEnroll, btnVerify, btnIdentify);

                lblDeviceStatus.Text = Disconnected;

                Thread.Sleep(1000);
                result = fpInstance.Finalize();   // CLEAR RESOURCES

                if (result == zkfp.ZKFP_ERR_OK)
                {
                    regTempLen = 0;
                    IsRegister = false;
                    cmbIdx.Items.Clear();
                    Utilities.EnableControls(true, btnInit);
                    Utilities.EnableControls(false, btnClose, btnEnroll, btnVerify, btnIdentify);

                    ReInitializeInstance();

                    DisplayMessage(MessageManager.msg_FP_Disconnected, true);
                }
                else
                    DisplayMessage(MessageManager.msg_FP_FailedToReleaseResources, false);


            }
            else
            {
                string errorMessage = FingerPrintDeviceUtilities.DisplayDeviceErrorByCode(result);
                DisplayMessage(errorMessage, false);
            }
        }


        #endregion



        #region ------- COMMON --------

        //private void FingerPrintControl_Load(object sender, EventArgs e) { FormHandle = this.Handle; }

        private void FingerPrintControl_Load(object sender, EventArgs e)
        {
            FormHandle = this.Handle;
        }

        private void ReInitializeInstance()
        {
            Utilities.EnableControls(true, btnInit);
            Utilities.EnableControls(false, btnClose, btnEnroll, btnVerify, btnIdentify);
            DisconnectFingerPrintCounter();
            bIdentify = true;
            btnVerify.Text = VerifyButtonDefault;
        }

        private void DisconnectFingerPrintCounter()
        {
            lblFingerPrintCount.Text = REGISTER_FINGER_COUNT.ToString();
            lblFingerPrintCount.Visible = false;
        }

        #endregion


        #region -------- UTILITIES --------


        /// <summary>
        /// Combines Three Pre-Registered Fingerprint Templates as One Registered Fingerprint Template
        /// </summary>
        /// <returns></returns>
        private int GenerateRegisteredFingerPrint()
        {
            return fpInstance.GenerateRegTemplate(RegTmps[0], RegTmps[1], RegTmps[2], RegTmp, ref regTempLen);
        }

        /// <summary>
        /// Add A Registered Fingerprint Template To Memory | params: (FingerPrint ID, Registered Template)
        /// </summary>
        /// <returns></returns>
        private int AddTemplateToMemory()
        {
            return fpInstance.AddRegTemplate(iFid, RegTmp);
        }




        private void DisplayFingerPrintImageForEnrollment()
        {
            // OPTIMIZED METHOD
            MemoryStream ms = new MemoryStream();
            BitmapFormat.GetBitmap(FPBuffer, mfpWidth, mfpHeight, ref ms);
            Bitmap bmp = new Bitmap(ms);
            this.picFPImg.Image = bmp;

        }

        private void DisplayFingerPrintImage()
        {
            // OPTIMIZED METHOD
            MemoryStream ms = new MemoryStream();
            BitmapFormat.GetBitmap(FPBuffer, mfpWidth, mfpHeight, ref ms);
            Bitmap bmp = new Bitmap(ms);

            this.parentForm.UpdateFingerprintPicture(bmp);
            

        }

        private void DisplayMessage(string message, bool normalMessage)
        {
            try
            {
                Utilities.ShowStatusBar(message, parentForm.statusBar1, normalMessage);
            }
            catch (Exception ex)
            {
                Utilities.ShowStatusBar(ex.Message, parentForm.statusBar1, false);
            }
        }

        private void DisplayEnrollmentMessage(string message, bool normalMessage)
        {
            try
            {
                Utilities.ShowStatusBarEnroll(message, enrollStatusBar, normalMessage);
            }
            catch (Exception ex)
            {
                Utilities.ShowStatusBarEnroll(ex.Message, enrollStatusBar, false);
            }
        }


        





        #endregion

        private void cmbEmployeeList_SelectedIndexChanged(object sender, EventArgs e)
        {
            bool isEmployeeOkayForEnrollment = false;
            //check if the employee already have the biometrics info
            //if no then proceed

            if(cmbEmployeeList.SelectedIndex == -1)
            {
                return;
            }

            SelectedEmployee employee = (SelectedEmployee)(cmbEmployeeList.SelectedItem as ComboboxItem).Value;

            //check if have biometric info
            //BiometricInfo biometricInfo = sBiometricInfo.GetBiometricInfo(employee.timekeeping_id);

            int template_count = sBiometricInfo.CountEmployeeEnrolledTemplates(employee.timekeeping_id);

            lblEnrolledTemplatesCount.Text = template_count + " of 3";


            if(template_count >= 3)
            {
                //not allowed to enroll
                isEmployeeOkayForEnrollment = false;

                DialogResult dr = MessageBox.Show("Already rech the maximum count for template enrollment. Do you want to delete and re-enroll?", "Confirm Re-Enroll", MessageBoxButtons.YesNo, MessageBoxIcon.Information);

                if (dr == DialogResult.Yes)
                {
                    //get all biometric infos related to the employee
                    IEnumerable<BiometricInfo> bios = sBiometricInfo.GetBiometricInfos(employee.timekeeping_id);

                    // delete the record on the database
                    int biores = sBiometricInfo.DeleteBiometricInfo(employee.timekeeping_id);

                    // if success then delete it also on the device
                    if(biores == 1)
                    {
                        foreach (BiometricInfo bio in bios)
                        {
                            fpInstance.DelRegTemplate(bio.Id);
                        }
                    }
                    //if (biores == 1) sTimeKeepingInfo.UpdateTimeKeepingInfo(employee.timekeeping_id, 0);

                    cmbEmployeeList.SelectedIndex = -1;
                }

            }
            else if(template_count > 0 && template_count < 3)
            {
                //can enroll
                isEmployeeOkayForEnrollment = true;
            }
            else
            {
                //can enroll
                isEmployeeOkayForEnrollment = true;
            }


            //if (template_count > 0)
            //{
            //    Console.WriteLine(biometricInfo.Id);
            //    isEmployeeOkayForEnrollment = false;

            //    DialogResult dr = MessageBox.Show("Fingerprint already enrolled. Do you want to delete it and re-enroll?", "Confirm Re-Enroll", MessageBoxButtons.YesNo, MessageBoxIcon.Information);

            //    if (dr == DialogResult.Yes)
            //    {
            //        //delete the biometric info of the employee and empty the combobox listing again.
            //        int biores = sBiometricInfo.DeleteBiometricInfo(employee.timekeeping_id);
            //        if(biores == 1) sTimeKeepingInfo.UpdateTimeKeepingInfo(employee.timekeeping_id,0);

            //        cmbEmployeeList.SelectedIndex = -1;
            //    }
            //}
            //else
            //{
            //    Console.WriteLine("not exist");
            //    isEmployeeOkayForEnrollment = true;
            //}




            // if exist then show prompt for deletion
            if (!IsRegister && isEmployeeOkayForEnrollment)
            {
                ClearImage();
                IsRegister = true;
                RegisterCount = 0;
                regTempLen = 0;

                selEmpIdToEnroll = employee.employee_id;

                DisplayEnrollmentMessage("Please press your finger " + REGISTER_FINGER_COUNT + " times to Enroll.", true);

                lblFingerPrintCount.Visible = true;
                lblFingerPrintCount.Text = REGISTER_FINGER_COUNT.ToString();
            }
        }

        private void btnBrowsePhoto_Click(object sender, EventArgs e)
        {
            int size = -1;
            string file = null;

            DialogResult result = openFileDialog1.ShowDialog();
            if (result == DialogResult.OK)
            {
                file = openFileDialog1.FileName;

                this.picEmpPhoto.Image = new Bitmap(file);

                //load to the picturebox
                
            }
            Console.WriteLine(file);
        }
    }
}
