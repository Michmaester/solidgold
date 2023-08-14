namespace MecsTimeKeeper.Controls
{
    partial class FingerPrintControl
    {
        /// <summary> 
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary> 
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Component Designer generated code

        /// <summary> 
        /// Required method for Designer support - do not modify 
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.lblDeviceStatus = new System.Windows.Forms.Label();
            this.btnInit = new System.Windows.Forms.Button();
            this.lblFingerPrintCount = new System.Windows.Forms.Label();
            this.btnEnroll = new System.Windows.Forms.Button();
            this.cmbIdx = new System.Windows.Forms.ComboBox();
            this.label43 = new System.Windows.Forms.Label();
            this.btnVerify = new System.Windows.Forms.Button();
            this.btnIdentify = new System.Windows.Forms.Button();
            this.picFPImg = new System.Windows.Forms.PictureBox();
            this.btnClose = new System.Windows.Forms.Button();
            this.btnFree = new System.Windows.Forms.Button();
            this.cmbEmployeeList = new System.Windows.Forms.ComboBox();
            this.label1 = new System.Windows.Forms.Label();
            this.tabControl1 = new System.Windows.Forms.TabControl();
            this.Connection = new System.Windows.Forms.TabPage();
            this.tabPage2 = new System.Windows.Forms.TabPage();
            this.lblEnrolledTemplatesCount = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.picEmpPhoto = new System.Windows.Forms.PictureBox();
            this.btnBrowsePhoto = new System.Windows.Forms.Button();
            this.openFileDialog1 = new System.Windows.Forms.OpenFileDialog();
            this.btnUpload = new System.Windows.Forms.Button();
            this.enrollStatusBar = new MecsTimeKeeper.Controls.StatusBarEnroll();
            ((System.ComponentModel.ISupportInitialize)(this.picFPImg)).BeginInit();
            this.tabControl1.SuspendLayout();
            this.Connection.SuspendLayout();
            this.tabPage2.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.picEmpPhoto)).BeginInit();
            this.SuspendLayout();
            // 
            // lblDeviceStatus
            // 
            this.lblDeviceStatus.AutoEllipsis = true;
            this.lblDeviceStatus.BackColor = System.Drawing.Color.WhiteSmoke;
            this.lblDeviceStatus.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Bold);
            this.lblDeviceStatus.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(105)))), ((int)(((byte)(204)))), ((int)(((byte)(240)))));
            this.lblDeviceStatus.Location = new System.Drawing.Point(9, 67);
            this.lblDeviceStatus.Margin = new System.Windows.Forms.Padding(3, 10, 3, 0);
            this.lblDeviceStatus.Name = "lblDeviceStatus";
            this.lblDeviceStatus.Padding = new System.Windows.Forms.Padding(10);
            this.lblDeviceStatus.Size = new System.Drawing.Size(317, 81);
            this.lblDeviceStatus.TabIndex = 792;
            this.lblDeviceStatus.Text = "Disconnected";
            // 
            // btnInit
            // 
            this.btnInit.BackColor = System.Drawing.Color.White;
            this.btnInit.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnInit.FlatAppearance.BorderColor = System.Drawing.SystemColors.ControlDark;
            this.btnInit.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnInit.Font = new System.Drawing.Font("Segoe UI", 9F);
            this.btnInit.ForeColor = System.Drawing.Color.Black;
            this.btnInit.Location = new System.Drawing.Point(9, 18);
            this.btnInit.Name = "btnInit";
            this.btnInit.Size = new System.Drawing.Size(151, 37);
            this.btnInit.TabIndex = 1;
            this.btnInit.Text = "Initialize Device";
            this.btnInit.UseVisualStyleBackColor = false;
            this.btnInit.Click += new System.EventHandler(this.btnInit_Click);
            // 
            // lblFingerPrintCount
            // 
            this.lblFingerPrintCount.AutoSize = true;
            this.lblFingerPrintCount.Font = new System.Drawing.Font("Tahoma", 30F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblFingerPrintCount.Location = new System.Drawing.Point(259, 115);
            this.lblFingerPrintCount.Name = "lblFingerPrintCount";
            this.lblFingerPrintCount.Size = new System.Drawing.Size(45, 48);
            this.lblFingerPrintCount.TabIndex = 793;
            this.lblFingerPrintCount.Text = "3";
            // 
            // btnEnroll
            // 
            this.btnEnroll.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(105)))), ((int)(((byte)(204)))), ((int)(((byte)(240)))));
            this.btnEnroll.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnEnroll.FlatAppearance.BorderColor = System.Drawing.Color.FromArgb(((int)(((byte)(105)))), ((int)(((byte)(204)))), ((int)(((byte)(240)))));
            this.btnEnroll.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnEnroll.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnEnroll.ForeColor = System.Drawing.Color.White;
            this.btnEnroll.Location = new System.Drawing.Point(9, 18);
            this.btnEnroll.Name = "btnEnroll";
            this.btnEnroll.Size = new System.Drawing.Size(317, 36);
            this.btnEnroll.TabIndex = 767;
            this.btnEnroll.Text = "Click To Enroll";
            this.btnEnroll.UseVisualStyleBackColor = false;
            this.btnEnroll.Click += new System.EventHandler(this.btnEnroll_Click);
            // 
            // cmbIdx
            // 
            this.cmbIdx.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cmbIdx.FormattingEnabled = true;
            this.cmbIdx.Location = new System.Drawing.Point(127, 161);
            this.cmbIdx.Name = "cmbIdx";
            this.cmbIdx.Size = new System.Drawing.Size(137, 24);
            this.cmbIdx.TabIndex = 787;
            this.cmbIdx.Visible = false;
            // 
            // label43
            // 
            this.label43.AutoSize = true;
            this.label43.Font = new System.Drawing.Font("Arial", 8.75F, System.Drawing.FontStyle.Bold);
            this.label43.ForeColor = System.Drawing.SystemColors.ControlDarkDark;
            this.label43.Location = new System.Drawing.Point(9, 165);
            this.label43.Name = "label43";
            this.label43.Size = new System.Drawing.Size(112, 15);
            this.label43.TabIndex = 788;
            this.label43.Text = "Available Devices :";
            this.label43.Visible = false;
            // 
            // btnVerify
            // 
            this.btnVerify.BackColor = System.Drawing.Color.White;
            this.btnVerify.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnVerify.FlatAppearance.BorderColor = System.Drawing.SystemColors.ControlDark;
            this.btnVerify.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnVerify.Font = new System.Drawing.Font("Segoe UI", 9F);
            this.btnVerify.ForeColor = System.Drawing.Color.Black;
            this.btnVerify.Location = new System.Drawing.Point(417, 165);
            this.btnVerify.Name = "btnVerify";
            this.btnVerify.Size = new System.Drawing.Size(99, 34);
            this.btnVerify.TabIndex = 789;
            this.btnVerify.Text = "Verify";
            this.btnVerify.UseVisualStyleBackColor = false;
            this.btnVerify.Click += new System.EventHandler(this.btnVerify_Click);
            // 
            // btnIdentify
            // 
            this.btnIdentify.BackColor = System.Drawing.Color.White;
            this.btnIdentify.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnIdentify.FlatAppearance.BorderColor = System.Drawing.SystemColors.ControlDark;
            this.btnIdentify.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnIdentify.Font = new System.Drawing.Font("Segoe UI", 9F);
            this.btnIdentify.ForeColor = System.Drawing.Color.Black;
            this.btnIdentify.Location = new System.Drawing.Point(417, 205);
            this.btnIdentify.Name = "btnIdentify";
            this.btnIdentify.Size = new System.Drawing.Size(98, 34);
            this.btnIdentify.TabIndex = 790;
            this.btnIdentify.Text = "Identify User";
            this.btnIdentify.UseVisualStyleBackColor = false;
            this.btnIdentify.Visible = false;
            this.btnIdentify.Click += new System.EventHandler(this.btnIdentify_Click);
            // 
            // picFPImg
            // 
            this.picFPImg.BackColor = System.Drawing.Color.Transparent;
            this.picFPImg.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.picFPImg.Location = new System.Drawing.Point(235, 165);
            this.picFPImg.Name = "picFPImg";
            this.picFPImg.Size = new System.Drawing.Size(91, 100);
            this.picFPImg.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.picFPImg.TabIndex = 791;
            this.picFPImg.TabStop = false;
            // 
            // btnClose
            // 
            this.btnClose.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(230)))), ((int)(((byte)(112)))), ((int)(((byte)(134)))));
            this.btnClose.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnClose.FlatAppearance.BorderColor = System.Drawing.Color.FromArgb(((int)(((byte)(230)))), ((int)(((byte)(112)))), ((int)(((byte)(134)))));
            this.btnClose.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnClose.Font = new System.Drawing.Font("Segoe UI", 9F);
            this.btnClose.ForeColor = System.Drawing.Color.White;
            this.btnClose.Location = new System.Drawing.Point(166, 18);
            this.btnClose.Name = "btnClose";
            this.btnClose.Size = new System.Drawing.Size(160, 37);
            this.btnClose.TabIndex = 777;
            this.btnClose.Text = "Disconnect Device";
            this.btnClose.UseVisualStyleBackColor = false;
            this.btnClose.Click += new System.EventHandler(this.btnClose_Click);
            // 
            // btnFree
            // 
            this.btnFree.BackColor = System.Drawing.Color.White;
            this.btnFree.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnFree.Enabled = false;
            this.btnFree.FlatAppearance.BorderColor = System.Drawing.SystemColors.ControlDark;
            this.btnFree.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnFree.Font = new System.Drawing.Font("Segoe UI", 9F);
            this.btnFree.ForeColor = System.Drawing.Color.Black;
            this.btnFree.Location = new System.Drawing.Point(417, 245);
            this.btnFree.Name = "btnFree";
            this.btnFree.Size = new System.Drawing.Size(99, 34);
            this.btnFree.TabIndex = 795;
            this.btnFree.Text = "Free Resources";
            this.btnFree.UseVisualStyleBackColor = false;
            this.btnFree.Click += new System.EventHandler(this.btnFree_Click);
            // 
            // cmbEmployeeList
            // 
            this.cmbEmployeeList.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.cmbEmployeeList.FormattingEnabled = true;
            this.cmbEmployeeList.Location = new System.Drawing.Point(9, 85);
            this.cmbEmployeeList.Name = "cmbEmployeeList";
            this.cmbEmployeeList.Size = new System.Drawing.Size(317, 27);
            this.cmbEmployeeList.TabIndex = 796;
            this.cmbEmployeeList.SelectedIndexChanged += new System.EventHandler(this.cmbEmployeeList_SelectedIndexChanged);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Arial", 8.75F, System.Drawing.FontStyle.Bold);
            this.label1.ForeColor = System.Drawing.SystemColors.ControlDarkDark;
            this.label1.Location = new System.Drawing.Point(6, 67);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(156, 15);
            this.label1.TabIndex = 797;
            this.label1.Text = "Select Employee to Enroll :";
            // 
            // tabControl1
            // 
            this.tabControl1.Controls.Add(this.Connection);
            this.tabControl1.Controls.Add(this.tabPage2);
            this.tabControl1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.tabControl1.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.tabControl1.Location = new System.Drawing.Point(0, 0);
            this.tabControl1.Name = "tabControl1";
            this.tabControl1.SelectedIndex = 0;
            this.tabControl1.Size = new System.Drawing.Size(340, 432);
            this.tabControl1.TabIndex = 798;
            // 
            // Connection
            // 
            this.Connection.Controls.Add(this.btnClose);
            this.Connection.Controls.Add(this.btnInit);
            this.Connection.Controls.Add(this.lblDeviceStatus);
            this.Connection.Controls.Add(this.label43);
            this.Connection.Controls.Add(this.cmbIdx);
            this.Connection.Location = new System.Drawing.Point(4, 25);
            this.Connection.Name = "Connection";
            this.Connection.Padding = new System.Windows.Forms.Padding(3);
            this.Connection.Size = new System.Drawing.Size(332, 403);
            this.Connection.TabIndex = 0;
            this.Connection.Text = "Connection";
            this.Connection.UseVisualStyleBackColor = true;
            // 
            // tabPage2
            // 
            this.tabPage2.Controls.Add(this.btnUpload);
            this.tabPage2.Controls.Add(this.btnBrowsePhoto);
            this.tabPage2.Controls.Add(this.picEmpPhoto);
            this.tabPage2.Controls.Add(this.enrollStatusBar);
            this.tabPage2.Controls.Add(this.lblEnrolledTemplatesCount);
            this.tabPage2.Controls.Add(this.label2);
            this.tabPage2.Controls.Add(this.btnEnroll);
            this.tabPage2.Controls.Add(this.label1);
            this.tabPage2.Controls.Add(this.lblFingerPrintCount);
            this.tabPage2.Controls.Add(this.cmbEmployeeList);
            this.tabPage2.Controls.Add(this.picFPImg);
            this.tabPage2.Location = new System.Drawing.Point(4, 25);
            this.tabPage2.Name = "tabPage2";
            this.tabPage2.Padding = new System.Windows.Forms.Padding(3);
            this.tabPage2.Size = new System.Drawing.Size(332, 403);
            this.tabPage2.TabIndex = 1;
            this.tabPage2.Text = "Enrollment";
            this.tabPage2.UseVisualStyleBackColor = true;
            // 
            // lblEnrolledTemplatesCount
            // 
            this.lblEnrolledTemplatesCount.AutoSize = true;
            this.lblEnrolledTemplatesCount.Font = new System.Drawing.Font("Arial", 8.75F, System.Drawing.FontStyle.Bold);
            this.lblEnrolledTemplatesCount.ForeColor = System.Drawing.SystemColors.ControlDarkDark;
            this.lblEnrolledTemplatesCount.Location = new System.Drawing.Point(133, 125);
            this.lblEnrolledTemplatesCount.Name = "lblEnrolledTemplatesCount";
            this.lblEnrolledTemplatesCount.Size = new System.Drawing.Size(11, 15);
            this.lblEnrolledTemplatesCount.TabIndex = 801;
            this.lblEnrolledTemplatesCount.Text = "-";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Arial", 8.75F, System.Drawing.FontStyle.Bold);
            this.label2.ForeColor = System.Drawing.SystemColors.ControlDarkDark;
            this.label2.Location = new System.Drawing.Point(6, 125);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(121, 15);
            this.label2.TabIndex = 800;
            this.label2.Text = "Enrolled Templates :";
            // 
            // picEmpPhoto
            // 
            this.picEmpPhoto.BackColor = System.Drawing.Color.Transparent;
            this.picEmpPhoto.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.picEmpPhoto.Location = new System.Drawing.Point(9, 165);
            this.picEmpPhoto.Name = "picEmpPhoto";
            this.picEmpPhoto.Size = new System.Drawing.Size(91, 100);
            this.picEmpPhoto.SizeMode = System.Windows.Forms.PictureBoxSizeMode.StretchImage;
            this.picEmpPhoto.TabIndex = 803;
            this.picEmpPhoto.TabStop = false;
            this.picEmpPhoto.Visible = false;
            // 
            // btnBrowsePhoto
            // 
            this.btnBrowsePhoto.Location = new System.Drawing.Point(106, 165);
            this.btnBrowsePhoto.Name = "btnBrowsePhoto";
            this.btnBrowsePhoto.Size = new System.Drawing.Size(75, 41);
            this.btnBrowsePhoto.TabIndex = 804;
            this.btnBrowsePhoto.Text = "Browse Photo";
            this.btnBrowsePhoto.UseVisualStyleBackColor = true;
            this.btnBrowsePhoto.Visible = false;
            this.btnBrowsePhoto.Click += new System.EventHandler(this.btnBrowsePhoto_Click);
            // 
            // openFileDialog1
            // 
            this.openFileDialog1.FileName = "openFileDialog1";
            // 
            // btnUpload
            // 
            this.btnUpload.Location = new System.Drawing.Point(106, 212);
            this.btnUpload.Name = "btnUpload";
            this.btnUpload.Size = new System.Drawing.Size(75, 53);
            this.btnUpload.TabIndex = 805;
            this.btnUpload.Text = "Upload";
            this.btnUpload.UseVisualStyleBackColor = true;
            this.btnUpload.Visible = false;
            // 
            // enrollStatusBar
            // 
            this.enrollStatusBar.BackColor = System.Drawing.Color.WhiteSmoke;
            this.enrollStatusBar.Dock = System.Windows.Forms.DockStyle.Bottom;
            this.enrollStatusBar.Font = new System.Drawing.Font("Tahoma", 15.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.enrollStatusBar.Location = new System.Drawing.Point(3, 286);
            this.enrollStatusBar.Margin = new System.Windows.Forms.Padding(3, 5, 3, 5);
            this.enrollStatusBar.Message = "";
            this.enrollStatusBar.MessageType = false;
            this.enrollStatusBar.Name = "enrollStatusBar";
            this.enrollStatusBar.Size = new System.Drawing.Size(326, 114);
            this.enrollStatusBar.StatusBarBackColor = System.Drawing.Color.WhiteSmoke;
            this.enrollStatusBar.StatusBarForeColor = System.Drawing.SystemColors.ControlText;
            this.enrollStatusBar.TabIndex = 802;
            // 
            // FingerPrintControl
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.tabControl1);
            this.Controls.Add(this.btnVerify);
            this.Controls.Add(this.btnIdentify);
            this.Controls.Add(this.btnFree);
            this.Name = "FingerPrintControl";
            this.Size = new System.Drawing.Size(340, 432);
            this.Load += new System.EventHandler(this.FingerPrintControl_Load);
            ((System.ComponentModel.ISupportInitialize)(this.picFPImg)).EndInit();
            this.tabControl1.ResumeLayout(false);
            this.Connection.ResumeLayout(false);
            this.Connection.PerformLayout();
            this.tabPage2.ResumeLayout(false);
            this.tabPage2.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.picEmpPhoto)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Label lblDeviceStatus;
        private System.Windows.Forms.Button btnInit;
        private System.Windows.Forms.Label lblFingerPrintCount;
        private System.Windows.Forms.Button btnEnroll;
        public System.Windows.Forms.ComboBox cmbIdx;
        private System.Windows.Forms.Label label43;
        private System.Windows.Forms.Button btnVerify;
        private System.Windows.Forms.Button btnIdentify;
        private System.Windows.Forms.PictureBox picFPImg;
        private System.Windows.Forms.Button btnClose;
        private System.Windows.Forms.Button btnFree;
        public System.Windows.Forms.ComboBox cmbEmployeeList;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TabControl tabControl1;
        private System.Windows.Forms.TabPage Connection;
        private System.Windows.Forms.TabPage tabPage2;
        private System.Windows.Forms.Label lblEnrolledTemplatesCount;
        private System.Windows.Forms.Label label2;
        public StatusBarEnroll enrollStatusBar;
        private System.Windows.Forms.Button btnUpload;
        private System.Windows.Forms.Button btnBrowsePhoto;
        private System.Windows.Forms.PictureBox picEmpPhoto;
        private System.Windows.Forms.OpenFileDialog openFileDialog1;
    }
}
