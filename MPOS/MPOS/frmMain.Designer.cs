namespace MPOS
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
            this.btnTransactions = new System.Windows.Forms.Button();
            this.btnExit = new System.Windows.Forms.Button();
            this.btnReports = new System.Windows.Forms.Button();
            this.btnOrders = new System.Windows.Forms.Button();
            this.panel1 = new System.Windows.Forms.Panel();
            this.panel2 = new System.Windows.Forms.Panel();
            this.lblCurrentDateTime = new System.Windows.Forms.Label();
            this.panelDayClosedWrapper = new System.Windows.Forms.Panel();
            this.label2 = new System.Windows.Forms.Label();
            this.pboxMainLogo = new System.Windows.Forms.PictureBox();
            this.panelToolbar = new System.Windows.Forms.Panel();
            this.tmrSystem = new System.Windows.Forms.Timer(this.components);
            this.panelFooter = new System.Windows.Forms.Panel();
            this.lblSelectedBranch = new System.Windows.Forms.Label();
            this.lblUserLogged = new System.Windows.Forms.Label();
            this.label1 = new System.Windows.Forms.Label();
            this.panelContent = new System.Windows.Forms.Panel();
            this.panel1.SuspendLayout();
            this.panel2.SuspendLayout();
            this.panelDayClosedWrapper.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pboxMainLogo)).BeginInit();
            this.panelToolbar.SuspendLayout();
            this.panelFooter.SuspendLayout();
            this.SuspendLayout();
            // 
            // btnTransactions
            // 
            this.btnTransactions.BackColor = System.Drawing.Color.LightGray;
            this.btnTransactions.FlatAppearance.BorderSize = 0;
            this.btnTransactions.FlatAppearance.MouseDownBackColor = System.Drawing.Color.White;
            this.btnTransactions.FlatAppearance.MouseOverBackColor = System.Drawing.Color.White;
            this.btnTransactions.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnTransactions.Image = ((System.Drawing.Image)(resources.GetObject("btnTransactions.Image")));
            this.btnTransactions.Location = new System.Drawing.Point(119, 0);
            this.btnTransactions.Name = "btnTransactions";
            this.btnTransactions.Size = new System.Drawing.Size(105, 75);
            this.btnTransactions.TabIndex = 1;
            this.btnTransactions.Text = "Transactions";
            this.btnTransactions.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.btnTransactions.UseVisualStyleBackColor = false;
            this.btnTransactions.Click += new System.EventHandler(this.btnTransactions_Click);
            // 
            // btnExit
            // 
            this.btnExit.BackColor = System.Drawing.Color.LightGray;
            this.btnExit.FlatAppearance.BorderSize = 0;
            this.btnExit.FlatAppearance.MouseDownBackColor = System.Drawing.Color.White;
            this.btnExit.FlatAppearance.MouseOverBackColor = System.Drawing.Color.White;
            this.btnExit.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnExit.Image = ((System.Drawing.Image)(resources.GetObject("btnExit.Image")));
            this.btnExit.Location = new System.Drawing.Point(331, 0);
            this.btnExit.Name = "btnExit";
            this.btnExit.Size = new System.Drawing.Size(105, 75);
            this.btnExit.TabIndex = 2;
            this.btnExit.Text = "Exit";
            this.btnExit.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.btnExit.UseVisualStyleBackColor = false;
            this.btnExit.Click += new System.EventHandler(this.btnExit_Click);
            // 
            // btnReports
            // 
            this.btnReports.BackColor = System.Drawing.Color.LightGray;
            this.btnReports.FlatAppearance.BorderSize = 0;
            this.btnReports.FlatAppearance.MouseDownBackColor = System.Drawing.Color.White;
            this.btnReports.FlatAppearance.MouseOverBackColor = System.Drawing.Color.White;
            this.btnReports.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnReports.Image = ((System.Drawing.Image)(resources.GetObject("btnReports.Image")));
            this.btnReports.Location = new System.Drawing.Point(225, 0);
            this.btnReports.Name = "btnReports";
            this.btnReports.Size = new System.Drawing.Size(105, 75);
            this.btnReports.TabIndex = 4;
            this.btnReports.Text = "Reports";
            this.btnReports.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.btnReports.UseVisualStyleBackColor = false;
            this.btnReports.Click += new System.EventHandler(this.btnReports_Click);
            // 
            // btnOrders
            // 
            this.btnOrders.BackColor = System.Drawing.Color.LightGray;
            this.btnOrders.FlatAppearance.BorderSize = 0;
            this.btnOrders.FlatAppearance.MouseDownBackColor = System.Drawing.Color.White;
            this.btnOrders.FlatAppearance.MouseOverBackColor = System.Drawing.Color.White;
            this.btnOrders.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnOrders.Image = ((System.Drawing.Image)(resources.GetObject("btnOrders.Image")));
            this.btnOrders.Location = new System.Drawing.Point(13, 0);
            this.btnOrders.Name = "btnOrders";
            this.btnOrders.Size = new System.Drawing.Size(105, 75);
            this.btnOrders.TabIndex = 5;
            this.btnOrders.Text = "Orders";
            this.btnOrders.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.btnOrders.UseVisualStyleBackColor = false;
            this.btnOrders.Click += new System.EventHandler(this.btnOrders_Click);
            // 
            // panel1
            // 
            this.panel1.BackColor = System.Drawing.SystemColors.ControlDarkDark;
            this.panel1.Controls.Add(this.panel2);
            this.panel1.Controls.Add(this.panelDayClosedWrapper);
            this.panel1.Controls.Add(this.pboxMainLogo);
            this.panel1.Controls.Add(this.panelToolbar);
            this.panel1.Dock = System.Windows.Forms.DockStyle.Top;
            this.panel1.Location = new System.Drawing.Point(0, 0);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(1350, 75);
            this.panel1.TabIndex = 6;
            // 
            // panel2
            // 
            this.panel2.Controls.Add(this.lblCurrentDateTime);
            this.panel2.Dock = System.Windows.Forms.DockStyle.Right;
            this.panel2.Location = new System.Drawing.Point(498, 0);
            this.panel2.Name = "panel2";
            this.panel2.Size = new System.Drawing.Size(415, 75);
            this.panel2.TabIndex = 12;
            // 
            // lblCurrentDateTime
            // 
            this.lblCurrentDateTime.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblCurrentDateTime.ForeColor = System.Drawing.Color.White;
            this.lblCurrentDateTime.Location = new System.Drawing.Point(3, 26);
            this.lblCurrentDateTime.Name = "lblCurrentDateTime";
            this.lblCurrentDateTime.Size = new System.Drawing.Size(406, 23);
            this.lblCurrentDateTime.TabIndex = 10;
            this.lblCurrentDateTime.Text = "-";
            this.lblCurrentDateTime.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // panelDayClosedWrapper
            // 
            this.panelDayClosedWrapper.Controls.Add(this.label2);
            this.panelDayClosedWrapper.Location = new System.Drawing.Point(298, 3);
            this.panelDayClosedWrapper.Name = "panelDayClosedWrapper";
            this.panelDayClosedWrapper.Size = new System.Drawing.Size(194, 66);
            this.panelDayClosedWrapper.TabIndex = 11;
            this.panelDayClosedWrapper.Visible = false;
            // 
            // label2
            // 
            this.label2.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label2.ForeColor = System.Drawing.Color.OrangeRed;
            this.label2.Location = new System.Drawing.Point(11, 12);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(164, 40);
            this.label2.TabIndex = 0;
            this.label2.Text = "No actions allowed - Day Closed!";
            // 
            // pboxMainLogo
            // 
            this.pboxMainLogo.Image = ((System.Drawing.Image)(resources.GetObject("pboxMainLogo.Image")));
            this.pboxMainLogo.Location = new System.Drawing.Point(7, 5);
            this.pboxMainLogo.Name = "pboxMainLogo";
            this.pboxMainLogo.Size = new System.Drawing.Size(288, 64);
            this.pboxMainLogo.SizeMode = System.Windows.Forms.PictureBoxSizeMode.StretchImage;
            this.pboxMainLogo.TabIndex = 9;
            this.pboxMainLogo.TabStop = false;
            // 
            // panelToolbar
            // 
            this.panelToolbar.Controls.Add(this.btnExit);
            this.panelToolbar.Controls.Add(this.btnOrders);
            this.panelToolbar.Controls.Add(this.btnReports);
            this.panelToolbar.Controls.Add(this.btnTransactions);
            this.panelToolbar.Dock = System.Windows.Forms.DockStyle.Right;
            this.panelToolbar.Location = new System.Drawing.Point(913, 0);
            this.panelToolbar.Name = "panelToolbar";
            this.panelToolbar.Size = new System.Drawing.Size(437, 75);
            this.panelToolbar.TabIndex = 7;
            // 
            // tmrSystem
            // 
            this.tmrSystem.Interval = 1000;
            this.tmrSystem.Tick += new System.EventHandler(this.tmrSystem_Tick);
            // 
            // panelFooter
            // 
            this.panelFooter.BackColor = System.Drawing.Color.DimGray;
            this.panelFooter.Controls.Add(this.lblSelectedBranch);
            this.panelFooter.Controls.Add(this.lblUserLogged);
            this.panelFooter.Controls.Add(this.label1);
            this.panelFooter.Dock = System.Windows.Forms.DockStyle.Bottom;
            this.panelFooter.Location = new System.Drawing.Point(0, 668);
            this.panelFooter.Margin = new System.Windows.Forms.Padding(0);
            this.panelFooter.Name = "panelFooter";
            this.panelFooter.Size = new System.Drawing.Size(1350, 28);
            this.panelFooter.TabIndex = 9;
            // 
            // lblSelectedBranch
            // 
            this.lblSelectedBranch.Dock = System.Windows.Forms.DockStyle.Right;
            this.lblSelectedBranch.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblSelectedBranch.ForeColor = System.Drawing.Color.White;
            this.lblSelectedBranch.Location = new System.Drawing.Point(1105, 0);
            this.lblSelectedBranch.Name = "lblSelectedBranch";
            this.lblSelectedBranch.Size = new System.Drawing.Size(245, 28);
            this.lblSelectedBranch.TabIndex = 2;
            this.lblSelectedBranch.Text = "-";
            this.lblSelectedBranch.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // lblUserLogged
            // 
            this.lblUserLogged.AutoSize = true;
            this.lblUserLogged.ForeColor = System.Drawing.Color.White;
            this.lblUserLogged.Location = new System.Drawing.Point(93, 7);
            this.lblUserLogged.Name = "lblUserLogged";
            this.lblUserLogged.Size = new System.Drawing.Size(11, 13);
            this.lblUserLogged.TabIndex = 1;
            this.lblUserLogged.Text = "-";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.ForeColor = System.Drawing.Color.White;
            this.label1.Location = new System.Drawing.Point(7, 7);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(83, 13);
            this.label1.TabIndex = 0;
            this.label1.Text = "Logged User :";
            // 
            // panelContent
            // 
            this.panelContent.BackColor = System.Drawing.Color.White;
            this.panelContent.Dock = System.Windows.Forms.DockStyle.Fill;
            this.panelContent.Location = new System.Drawing.Point(0, 75);
            this.panelContent.Name = "panelContent";
            this.panelContent.Size = new System.Drawing.Size(1350, 593);
            this.panelContent.TabIndex = 10;
            // 
            // frmMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1350, 696);
            this.Controls.Add(this.panelContent);
            this.Controls.Add(this.panelFooter);
            this.Controls.Add(this.panel1);
            this.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.Name = "frmMain";
            this.Text = "MPOS - Solidgold";
            this.WindowState = System.Windows.Forms.FormWindowState.Maximized;
            this.Load += new System.EventHandler(this.Form1_Load);
            this.panel1.ResumeLayout(false);
            this.panel2.ResumeLayout(false);
            this.panelDayClosedWrapper.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.pboxMainLogo)).EndInit();
            this.panelToolbar.ResumeLayout(false);
            this.panelFooter.ResumeLayout(false);
            this.panelFooter.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion
        private System.Windows.Forms.Button btnTransactions;
        private System.Windows.Forms.Button btnExit;
        private System.Windows.Forms.Button btnReports;
        private System.Windows.Forms.Button btnOrders;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.Panel panelToolbar;
        private System.Windows.Forms.Label lblCurrentDateTime;
        private System.Windows.Forms.PictureBox pboxMainLogo;
        private System.Windows.Forms.Timer tmrSystem;
        private System.Windows.Forms.Panel panelFooter;
        private System.Windows.Forms.Panel panelContent;
        private System.Windows.Forms.Label lblUserLogged;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label lblSelectedBranch;
        private System.Windows.Forms.Panel panelDayClosedWrapper;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Panel panel2;
    }
}

