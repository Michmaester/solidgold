namespace MecsTimeKeeper.Forms
{
    partial class frmMain
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

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(frmMain));
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle1 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle3 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle4 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle2 = new System.Windows.Forms.DataGridViewCellStyle();
            this.panel1 = new System.Windows.Forms.Panel();
            this.pnlStage = new System.Windows.Forms.Panel();
            this.panel4 = new System.Windows.Forms.Panel();
            this.picFingerprint = new System.Windows.Forms.PictureBox();
            this.picSysLogo = new System.Windows.Forms.PictureBox();
            this.picCompanyLogo = new System.Windows.Forms.PictureBox();
            this.panel2 = new System.Windows.Forms.Panel();
            this.panel8 = new System.Windows.Forms.Panel();
            this.dgvDailyTimeLogs = new System.Windows.Forms.DataGridView();
            this.dataGridViewTextBoxColumn1 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Column4 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Column5 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.panel6 = new System.Windows.Forms.Panel();
            this.button3 = new System.Windows.Forms.Button();
            this.button2 = new System.Windows.Forms.Button();
            this.button1 = new System.Windows.Forms.Button();
            this.panelEmpDetail = new System.Windows.Forms.Panel();
            this.label2 = new System.Windows.Forms.Label();
            this.label1 = new System.Windows.Forms.Label();
            this.lblEmpId = new System.Windows.Forms.Label();
            this.lblEmpName = new System.Windows.Forms.Label();
            this.picEmp = new System.Windows.Forms.PictureBox();
            this.panel5 = new System.Windows.Forms.Panel();
            this.panel3 = new System.Windows.Forms.Panel();
            this.panel10 = new System.Windows.Forms.Panel();
            this.lblSysDate = new System.Windows.Forms.Label();
            this.lblSysTime = new System.Windows.Forms.Label();
            this.panel9 = new System.Windows.Forms.Panel();
            this.tmrSysTimer = new System.Windows.Forms.Timer(this.components);
            this.statusBar1 = new MecsTimeKeeper.Controls.StatusBar();
            this.button4 = new System.Windows.Forms.Button();
            this.panel1.SuspendLayout();
            this.panel4.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.picFingerprint)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.picSysLogo)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.picCompanyLogo)).BeginInit();
            this.panel2.SuspendLayout();
            this.panel8.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dgvDailyTimeLogs)).BeginInit();
            this.panel6.SuspendLayout();
            this.panelEmpDetail.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.picEmp)).BeginInit();
            this.panel5.SuspendLayout();
            this.panel3.SuspendLayout();
            this.panel10.SuspendLayout();
            this.panel9.SuspendLayout();
            this.SuspendLayout();
            // 
            // panel1
            // 
            this.panel1.BackColor = System.Drawing.Color.WhiteSmoke;
            this.panel1.Controls.Add(this.pnlStage);
            this.panel1.Controls.Add(this.panel4);
            this.panel1.Dock = System.Windows.Forms.DockStyle.Right;
            this.panel1.Location = new System.Drawing.Point(985, 0);
            this.panel1.Name = "panel1";
            this.panel1.Padding = new System.Windows.Forms.Padding(10);
            this.panel1.Size = new System.Drawing.Size(365, 730);
            this.panel1.TabIndex = 4;
            // 
            // pnlStage
            // 
            this.pnlStage.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlStage.Location = new System.Drawing.Point(10, 199);
            this.pnlStage.Name = "pnlStage";
            this.pnlStage.Size = new System.Drawing.Size(345, 521);
            this.pnlStage.TabIndex = 6;
            // 
            // panel4
            // 
            this.panel4.Controls.Add(this.picFingerprint);
            this.panel4.Controls.Add(this.picSysLogo);
            this.panel4.Dock = System.Windows.Forms.DockStyle.Top;
            this.panel4.Location = new System.Drawing.Point(10, 10);
            this.panel4.Name = "panel4";
            this.panel4.Size = new System.Drawing.Size(345, 189);
            this.panel4.TabIndex = 5;
            // 
            // picFingerprint
            // 
            this.picFingerprint.BackColor = System.Drawing.Color.White;
            this.picFingerprint.Location = new System.Drawing.Point(3, 125);
            this.picFingerprint.Name = "picFingerprint";
            this.picFingerprint.Size = new System.Drawing.Size(40, 54);
            this.picFingerprint.SizeMode = System.Windows.Forms.PictureBoxSizeMode.StretchImage;
            this.picFingerprint.TabIndex = 792;
            this.picFingerprint.TabStop = false;
            // 
            // picSysLogo
            // 
            this.picSysLogo.Image = ((System.Drawing.Image)(resources.GetObject("picSysLogo.Image")));
            this.picSysLogo.Location = new System.Drawing.Point(61, 4);
            this.picSysLogo.Name = "picSysLogo";
            this.picSysLogo.Size = new System.Drawing.Size(223, 185);
            this.picSysLogo.TabIndex = 0;
            this.picSysLogo.TabStop = false;
            this.picSysLogo.DoubleClick += new System.EventHandler(this.picSysLogo_DoubleClick);
            // 
            // picCompanyLogo
            // 
            this.picCompanyLogo.Location = new System.Drawing.Point(16, 33);
            this.picCompanyLogo.Name = "picCompanyLogo";
            this.picCompanyLogo.Size = new System.Drawing.Size(214, 45);
            this.picCompanyLogo.TabIndex = 5;
            this.picCompanyLogo.TabStop = false;
            // 
            // panel2
            // 
            this.panel2.BackColor = System.Drawing.Color.White;
            this.panel2.Controls.Add(this.panel8);
            this.panel2.Controls.Add(this.panel6);
            this.panel2.Controls.Add(this.panel5);
            this.panel2.Controls.Add(this.panel3);
            this.panel2.Dock = System.Windows.Forms.DockStyle.Fill;
            this.panel2.Location = new System.Drawing.Point(0, 0);
            this.panel2.Name = "panel2";
            this.panel2.Size = new System.Drawing.Size(985, 730);
            this.panel2.TabIndex = 5;
            // 
            // panel8
            // 
            this.panel8.Controls.Add(this.dgvDailyTimeLogs);
            this.panel8.Dock = System.Windows.Forms.DockStyle.Fill;
            this.panel8.Location = new System.Drawing.Point(0, 551);
            this.panel8.Name = "panel8";
            this.panel8.Padding = new System.Windows.Forms.Padding(10);
            this.panel8.Size = new System.Drawing.Size(985, 179);
            this.panel8.TabIndex = 11;
            // 
            // dgvDailyTimeLogs
            // 
            this.dgvDailyTimeLogs.AllowUserToAddRows = false;
            this.dgvDailyTimeLogs.AllowUserToDeleteRows = false;
            this.dgvDailyTimeLogs.AllowUserToResizeColumns = false;
            this.dgvDailyTimeLogs.AllowUserToResizeRows = false;
            this.dgvDailyTimeLogs.BackgroundColor = System.Drawing.Color.WhiteSmoke;
            this.dgvDailyTimeLogs.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.dgvDailyTimeLogs.ColumnHeadersBorderStyle = System.Windows.Forms.DataGridViewHeaderBorderStyle.Single;
            dataGridViewCellStyle1.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle1.BackColor = System.Drawing.Color.DimGray;
            dataGridViewCellStyle1.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle1.ForeColor = System.Drawing.Color.White;
            dataGridViewCellStyle1.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle1.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle1.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.dgvDailyTimeLogs.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle1;
            this.dgvDailyTimeLogs.ColumnHeadersHeight = 40;
            this.dgvDailyTimeLogs.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.DisableResizing;
            this.dgvDailyTimeLogs.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.dataGridViewTextBoxColumn1,
            this.Column4,
            this.Column5});
            dataGridViewCellStyle3.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle3.BackColor = System.Drawing.SystemColors.Window;
            dataGridViewCellStyle3.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle3.ForeColor = System.Drawing.SystemColors.ControlText;
            dataGridViewCellStyle3.SelectionBackColor = System.Drawing.Color.FromArgb(((int)(((byte)(105)))), ((int)(((byte)(204)))), ((int)(((byte)(240)))));
            dataGridViewCellStyle3.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle3.WrapMode = System.Windows.Forms.DataGridViewTriState.False;
            this.dgvDailyTimeLogs.DefaultCellStyle = dataGridViewCellStyle3;
            this.dgvDailyTimeLogs.Dock = System.Windows.Forms.DockStyle.Fill;
            this.dgvDailyTimeLogs.EnableHeadersVisualStyles = false;
            this.dgvDailyTimeLogs.Location = new System.Drawing.Point(10, 10);
            this.dgvDailyTimeLogs.MultiSelect = false;
            this.dgvDailyTimeLogs.Name = "dgvDailyTimeLogs";
            this.dgvDailyTimeLogs.ReadOnly = true;
            this.dgvDailyTimeLogs.RowHeadersBorderStyle = System.Windows.Forms.DataGridViewHeaderBorderStyle.None;
            dataGridViewCellStyle4.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle4.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle4.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle4.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle4.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle4.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.dgvDailyTimeLogs.RowHeadersDefaultCellStyle = dataGridViewCellStyle4;
            this.dgvDailyTimeLogs.RowHeadersVisible = false;
            this.dgvDailyTimeLogs.RowTemplate.DefaultCellStyle.Font = new System.Drawing.Font("Tahoma", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.dgvDailyTimeLogs.RowTemplate.Height = 30;
            this.dgvDailyTimeLogs.RowTemplate.Resizable = System.Windows.Forms.DataGridViewTriState.False;
            this.dgvDailyTimeLogs.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.dgvDailyTimeLogs.Size = new System.Drawing.Size(965, 159);
            this.dgvDailyTimeLogs.TabIndex = 9;
            // 
            // dataGridViewTextBoxColumn1
            // 
            this.dataGridViewTextBoxColumn1.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.Fill;
            dataGridViewCellStyle2.Font = new System.Drawing.Font("Tahoma", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.dataGridViewTextBoxColumn1.DefaultCellStyle = dataGridViewCellStyle2;
            this.dataGridViewTextBoxColumn1.HeaderText = "Date";
            this.dataGridViewTextBoxColumn1.Name = "dataGridViewTextBoxColumn1";
            this.dataGridViewTextBoxColumn1.ReadOnly = true;
            this.dataGridViewTextBoxColumn1.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            // 
            // Column4
            // 
            this.Column4.HeaderText = "Time";
            this.Column4.Name = "Column4";
            this.Column4.ReadOnly = true;
            this.Column4.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            this.Column4.Width = 200;
            // 
            // Column5
            // 
            this.Column5.HeaderText = "Shift";
            this.Column5.Name = "Column5";
            this.Column5.ReadOnly = true;
            this.Column5.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            this.Column5.Width = 200;
            // 
            // panel6
            // 
            this.panel6.Controls.Add(this.button4);
            this.panel6.Controls.Add(this.button3);
            this.panel6.Controls.Add(this.button2);
            this.panel6.Controls.Add(this.button1);
            this.panel6.Controls.Add(this.panelEmpDetail);
            this.panel6.Dock = System.Windows.Forms.DockStyle.Top;
            this.panel6.Location = new System.Drawing.Point(0, 256);
            this.panel6.Name = "panel6";
            this.panel6.Padding = new System.Windows.Forms.Padding(10);
            this.panel6.Size = new System.Drawing.Size(985, 295);
            this.panel6.TabIndex = 10;
            // 
            // button3
            // 
            this.button3.Location = new System.Drawing.Point(874, 116);
            this.button3.Name = "button3";
            this.button3.Size = new System.Drawing.Size(101, 36);
            this.button3.TabIndex = 14;
            this.button3.Text = "Insert DTL";
            this.button3.UseVisualStyleBackColor = true;
            this.button3.Click += new System.EventHandler(this.button3_Click);
            // 
            // button2
            // 
            this.button2.Location = new System.Drawing.Point(874, 74);
            this.button2.Name = "button2";
            this.button2.Size = new System.Drawing.Size(101, 36);
            this.button2.TabIndex = 13;
            this.button2.Text = "Insert DTR";
            this.button2.UseVisualStyleBackColor = true;
            this.button2.Click += new System.EventHandler(this.button2_Click);
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(874, 13);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(101, 36);
            this.button1.TabIndex = 12;
            this.button1.Text = "BlockList";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // panelEmpDetail
            // 
            this.panelEmpDetail.Controls.Add(this.label2);
            this.panelEmpDetail.Controls.Add(this.label1);
            this.panelEmpDetail.Controls.Add(this.lblEmpId);
            this.panelEmpDetail.Controls.Add(this.lblEmpName);
            this.panelEmpDetail.Controls.Add(this.picEmp);
            this.panelEmpDetail.Location = new System.Drawing.Point(10, 10);
            this.panelEmpDetail.Name = "panelEmpDetail";
            this.panelEmpDetail.Size = new System.Drawing.Size(664, 275);
            this.panelEmpDetail.TabIndex = 11;
            this.panelEmpDetail.Visible = false;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Tahoma", 27.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label2.ForeColor = System.Drawing.Color.Gold;
            this.label2.Location = new System.Drawing.Point(288, 136);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(193, 45);
            this.label2.TabIndex = 11;
            this.label2.Text = "EMP. ID :";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Tahoma", 27.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.ForeColor = System.Drawing.Color.Gold;
            this.label1.Location = new System.Drawing.Point(327, 74);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(154, 45);
            this.label1.TabIndex = 10;
            this.label1.Text = "NAME :";
            // 
            // lblEmpId
            // 
            this.lblEmpId.AutoSize = true;
            this.lblEmpId.Font = new System.Drawing.Font("Tahoma", 27.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblEmpId.ForeColor = System.Drawing.Color.DimGray;
            this.lblEmpId.Location = new System.Drawing.Point(477, 136);
            this.lblEmpId.Name = "lblEmpId";
            this.lblEmpId.Size = new System.Drawing.Size(36, 45);
            this.lblEmpId.TabIndex = 9;
            this.lblEmpId.Text = "-";
            // 
            // lblEmpName
            // 
            this.lblEmpName.AutoSize = true;
            this.lblEmpName.Font = new System.Drawing.Font("Tahoma", 27.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblEmpName.ForeColor = System.Drawing.Color.DimGray;
            this.lblEmpName.Location = new System.Drawing.Point(477, 74);
            this.lblEmpName.Name = "lblEmpName";
            this.lblEmpName.Size = new System.Drawing.Size(36, 45);
            this.lblEmpName.TabIndex = 8;
            this.lblEmpName.Text = "-";
            // 
            // picEmp
            // 
            this.picEmp.BackColor = System.Drawing.Color.WhiteSmoke;
            this.picEmp.Location = new System.Drawing.Point(104, 53);
            this.picEmp.Name = "picEmp";
            this.picEmp.Padding = new System.Windows.Forms.Padding(5);
            this.picEmp.Size = new System.Drawing.Size(164, 179);
            this.picEmp.SizeMode = System.Windows.Forms.PictureBoxSizeMode.StretchImage;
            this.picEmp.TabIndex = 7;
            this.picEmp.TabStop = false;
            // 
            // panel5
            // 
            this.panel5.Controls.Add(this.statusBar1);
            this.panel5.Dock = System.Windows.Forms.DockStyle.Top;
            this.panel5.Location = new System.Drawing.Point(0, 125);
            this.panel5.Name = "panel5";
            this.panel5.Padding = new System.Windows.Forms.Padding(10);
            this.panel5.Size = new System.Drawing.Size(985, 131);
            this.panel5.TabIndex = 9;
            // 
            // panel3
            // 
            this.panel3.BackColor = System.Drawing.Color.DimGray;
            this.panel3.Controls.Add(this.panel10);
            this.panel3.Controls.Add(this.panel9);
            this.panel3.Dock = System.Windows.Forms.DockStyle.Top;
            this.panel3.Location = new System.Drawing.Point(0, 0);
            this.panel3.Name = "panel3";
            this.panel3.Size = new System.Drawing.Size(985, 125);
            this.panel3.TabIndex = 5;
            // 
            // panel10
            // 
            this.panel10.Controls.Add(this.lblSysDate);
            this.panel10.Controls.Add(this.lblSysTime);
            this.panel10.Dock = System.Windows.Forms.DockStyle.Right;
            this.panel10.Location = new System.Drawing.Point(308, 0);
            this.panel10.Name = "panel10";
            this.panel10.Size = new System.Drawing.Size(677, 125);
            this.panel10.TabIndex = 8;
            // 
            // lblSysDate
            // 
            this.lblSysDate.AutoSize = true;
            this.lblSysDate.Font = new System.Drawing.Font("Tahoma", 18F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblSysDate.ForeColor = System.Drawing.Color.LightGray;
            this.lblSysDate.Location = new System.Drawing.Point(421, 11);
            this.lblSysDate.Name = "lblSysDate";
            this.lblSysDate.Size = new System.Drawing.Size(246, 29);
            this.lblSysDate.TabIndex = 6;
            this.lblSysDate.Text = "December 01, 2020";
            this.lblSysDate.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // lblSysTime
            // 
            this.lblSysTime.Font = new System.Drawing.Font("Tahoma", 54.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblSysTime.ForeColor = System.Drawing.Color.Gold;
            this.lblSysTime.Location = new System.Drawing.Point(137, 21);
            this.lblSysTime.Name = "lblSysTime";
            this.lblSysTime.Size = new System.Drawing.Size(549, 105);
            this.lblSysTime.TabIndex = 4;
            this.lblSysTime.Text = "00:00:00 AM";
            this.lblSysTime.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // panel9
            // 
            this.panel9.Controls.Add(this.picCompanyLogo);
            this.panel9.Dock = System.Windows.Forms.DockStyle.Left;
            this.panel9.Location = new System.Drawing.Point(0, 0);
            this.panel9.Name = "panel9";
            this.panel9.Size = new System.Drawing.Size(264, 125);
            this.panel9.TabIndex = 7;
            // 
            // tmrSysTimer
            // 
            this.tmrSysTimer.Interval = 1000;
            this.tmrSysTimer.Tick += new System.EventHandler(this.tmrSysTimer_Tick);
            // 
            // statusBar1
            // 
            this.statusBar1.BackColor = System.Drawing.Color.Gainsboro;
            this.statusBar1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.statusBar1.Font = new System.Drawing.Font("Tahoma", 21.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.statusBar1.Location = new System.Drawing.Point(10, 10);
            this.statusBar1.Margin = new System.Windows.Forms.Padding(8, 8, 8, 8);
            this.statusBar1.Message = "";
            this.statusBar1.MessageType = false;
            this.statusBar1.Name = "statusBar1";
            this.statusBar1.Size = new System.Drawing.Size(965, 111);
            this.statusBar1.StatusBarBackColor = System.Drawing.Color.Gainsboro;
            this.statusBar1.StatusBarForeColor = System.Drawing.SystemColors.ControlText;
            this.statusBar1.TabIndex = 0;
            // 
            // button4
            // 
            this.button4.Location = new System.Drawing.Point(767, 74);
            this.button4.Name = "button4";
            this.button4.Size = new System.Drawing.Size(101, 36);
            this.button4.TabIndex = 15;
            this.button4.Text = "Get LastId";
            this.button4.UseVisualStyleBackColor = true;
            this.button4.Click += new System.EventHandler(this.button4_Click);
            // 
            // frmMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1350, 730);
            this.Controls.Add(this.panel2);
            this.Controls.Add(this.panel1);
            this.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.Name = "frmMain";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Text = "MECS TimeKeeper";
            this.WindowState = System.Windows.Forms.FormWindowState.Maximized;
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.frmMain_FormClosing);
            this.Load += new System.EventHandler(this.frmMain_Load);
            this.panel1.ResumeLayout(false);
            this.panel4.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.picFingerprint)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.picSysLogo)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.picCompanyLogo)).EndInit();
            this.panel2.ResumeLayout(false);
            this.panel8.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.dgvDailyTimeLogs)).EndInit();
            this.panel6.ResumeLayout(false);
            this.panelEmpDetail.ResumeLayout(false);
            this.panelEmpDetail.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.picEmp)).EndInit();
            this.panel5.ResumeLayout(false);
            this.panel3.ResumeLayout(false);
            this.panel10.ResumeLayout(false);
            this.panel10.PerformLayout();
            this.panel9.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.Label lblSysDate;
        private System.Windows.Forms.Label lblSysTime;
        private System.Windows.Forms.Panel panel2;
        private System.Windows.Forms.Panel panel3;
        private System.Windows.Forms.Timer tmrSysTimer;
        private System.Windows.Forms.Panel panel4;
        private System.Windows.Forms.Panel panel6;
        private System.Windows.Forms.Label lblEmpName;
        private System.Windows.Forms.PictureBox picEmp;
        private System.Windows.Forms.Panel panel5;
        public Controls.StatusBar statusBar;
        private System.Windows.Forms.Panel pnlStage;
        private System.Windows.Forms.PictureBox picCompanyLogo;
        private System.Windows.Forms.Panel panelEmpDetail;
        private System.Windows.Forms.PictureBox picFingerprint;
        private System.Windows.Forms.Panel panel8;
        private System.Windows.Forms.Panel panel10;
        private System.Windows.Forms.Panel panel9;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label lblEmpId;
        private System.Windows.Forms.PictureBox picSysLogo;
        private System.Windows.Forms.DataGridView dgvDailyTimeLogs;
        private System.Windows.Forms.DataGridViewTextBoxColumn dataGridViewTextBoxColumn1;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column4;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column5;
        public Controls.StatusBar statusBar1;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.Button button3;
        private System.Windows.Forms.Button button2;
        private System.Windows.Forms.Button button4;
    }
}