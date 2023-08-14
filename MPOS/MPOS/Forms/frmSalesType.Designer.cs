namespace MPOS.Forms
{
    partial class frmSalesType
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(frmSalesType));
            this.btnEnter = new System.Windows.Forms.Button();
            this.btnClose = new System.Windows.Forms.Button();
            this.panel1 = new System.Windows.Forms.Panel();
            this.rdbWholesale = new System.Windows.Forms.RadioButton();
            this.rdbRetail = new System.Windows.Forms.RadioButton();
            this.panel1.SuspendLayout();
            this.SuspendLayout();
            // 
            // btnEnter
            // 
            this.btnEnter.BackColor = System.Drawing.SystemColors.HotTrack;
            this.btnEnter.FlatAppearance.BorderSize = 0;
            this.btnEnter.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnEnter.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnEnter.ForeColor = System.Drawing.Color.White;
            this.btnEnter.Location = new System.Drawing.Point(112, 107);
            this.btnEnter.Name = "btnEnter";
            this.btnEnter.Size = new System.Drawing.Size(167, 62);
            this.btnEnter.TabIndex = 0;
            this.btnEnter.Text = "Enter";
            this.btnEnter.UseVisualStyleBackColor = false;
            this.btnEnter.Click += new System.EventHandler(this.btnEnter_Click);
            // 
            // btnClose
            // 
            this.btnClose.BackColor = System.Drawing.Color.MistyRose;
            this.btnClose.FlatAppearance.BorderSize = 0;
            this.btnClose.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnClose.Location = new System.Drawing.Point(12, 107);
            this.btnClose.Name = "btnClose";
            this.btnClose.Size = new System.Drawing.Size(94, 62);
            this.btnClose.TabIndex = 1;
            this.btnClose.Text = "Close";
            this.btnClose.UseVisualStyleBackColor = false;
            this.btnClose.Click += new System.EventHandler(this.btnClose_Click);
            // 
            // panel1
            // 
            this.panel1.BackColor = System.Drawing.Color.White;
            this.panel1.Controls.Add(this.rdbWholesale);
            this.panel1.Controls.Add(this.rdbRetail);
            this.panel1.Dock = System.Windows.Forms.DockStyle.Top;
            this.panel1.Location = new System.Drawing.Point(0, 0);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(290, 87);
            this.panel1.TabIndex = 3;
            // 
            // rdbWholesale
            // 
            this.rdbWholesale.Appearance = System.Windows.Forms.Appearance.Button;
            this.rdbWholesale.FlatStyle = System.Windows.Forms.FlatStyle.System;
            this.rdbWholesale.Font = new System.Drawing.Font("Tahoma", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rdbWholesale.ForeColor = System.Drawing.Color.Black;
            this.rdbWholesale.Location = new System.Drawing.Point(148, 12);
            this.rdbWholesale.Name = "rdbWholesale";
            this.rdbWholesale.Size = new System.Drawing.Size(131, 63);
            this.rdbWholesale.TabIndex = 1;
            this.rdbWholesale.TabStop = true;
            this.rdbWholesale.Text = "Wholesale";
            this.rdbWholesale.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.rdbWholesale.UseVisualStyleBackColor = true;
            this.rdbWholesale.CheckedChanged += new System.EventHandler(this.rdbWholesale_CheckedChanged);
            // 
            // rdbRetail
            // 
            this.rdbRetail.Appearance = System.Windows.Forms.Appearance.Button;
            this.rdbRetail.FlatStyle = System.Windows.Forms.FlatStyle.System;
            this.rdbRetail.Font = new System.Drawing.Font("Tahoma", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rdbRetail.Location = new System.Drawing.Point(11, 12);
            this.rdbRetail.Name = "rdbRetail";
            this.rdbRetail.Size = new System.Drawing.Size(131, 63);
            this.rdbRetail.TabIndex = 0;
            this.rdbRetail.TabStop = true;
            this.rdbRetail.Text = "Retail";
            this.rdbRetail.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.rdbRetail.UseVisualStyleBackColor = true;
            this.rdbRetail.CheckedChanged += new System.EventHandler(this.rdbRetail_CheckedChanged);
            // 
            // frmSalesType
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(290, 178);
            this.Controls.Add(this.panel1);
            this.Controls.Add(this.btnClose);
            this.Controls.Add(this.btnEnter);
            this.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.KeyPreview = true;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "frmSalesType";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Text = "Sales Type";
            this.Load += new System.EventHandler(this.frmSalesType_Load);
            this.KeyDown += new System.Windows.Forms.KeyEventHandler(this.frmSalesType_KeyDown);
            this.panel1.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Button btnEnter;
        private System.Windows.Forms.Button btnClose;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.RadioButton rdbWholesale;
        private System.Windows.Forms.RadioButton rdbRetail;
    }
}