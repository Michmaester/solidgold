namespace MPOS.Forms
{
    partial class frmShipment
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(frmShipment));
            this.rdbPickup = new System.Windows.Forms.RadioButton();
            this.rdbDelivery = new System.Windows.Forms.RadioButton();
            this.panel1 = new System.Windows.Forms.Panel();
            this.dtDeliveryRequestDate = new System.Windows.Forms.DateTimePicker();
            this.txtDeliveryNotes = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.txtDeliveryFee = new System.Windows.Forms.TextBox();
            this.panelDeliveryForm = new System.Windows.Forms.Panel();
            this.btnEnter = new System.Windows.Forms.Button();
            this.btnClose = new System.Windows.Forms.Button();
            this.panel1.SuspendLayout();
            this.panelDeliveryForm.SuspendLayout();
            this.SuspendLayout();
            // 
            // rdbPickup
            // 
            this.rdbPickup.Appearance = System.Windows.Forms.Appearance.Button;
            this.rdbPickup.FlatStyle = System.Windows.Forms.FlatStyle.System;
            this.rdbPickup.Font = new System.Drawing.Font("Tahoma", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rdbPickup.ForeColor = System.Drawing.SystemColors.HotTrack;
            this.rdbPickup.Location = new System.Drawing.Point(12, 12);
            this.rdbPickup.Name = "rdbPickup";
            this.rdbPickup.Size = new System.Drawing.Size(206, 63);
            this.rdbPickup.TabIndex = 0;
            this.rdbPickup.TabStop = true;
            this.rdbPickup.Text = "Pickup";
            this.rdbPickup.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.rdbPickup.UseVisualStyleBackColor = true;
            this.rdbPickup.CheckedChanged += new System.EventHandler(this.rdbPickup_CheckedChanged);
            // 
            // rdbDelivery
            // 
            this.rdbDelivery.Appearance = System.Windows.Forms.Appearance.Button;
            this.rdbDelivery.FlatStyle = System.Windows.Forms.FlatStyle.System;
            this.rdbDelivery.Font = new System.Drawing.Font("Tahoma", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rdbDelivery.ForeColor = System.Drawing.SystemColors.HotTrack;
            this.rdbDelivery.Location = new System.Drawing.Point(224, 12);
            this.rdbDelivery.Name = "rdbDelivery";
            this.rdbDelivery.Size = new System.Drawing.Size(206, 63);
            this.rdbDelivery.TabIndex = 1;
            this.rdbDelivery.TabStop = true;
            this.rdbDelivery.Text = "Delivery";
            this.rdbDelivery.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.rdbDelivery.UseVisualStyleBackColor = true;
            this.rdbDelivery.CheckedChanged += new System.EventHandler(this.rdbDelivery_CheckedChanged);
            // 
            // panel1
            // 
            this.panel1.BackColor = System.Drawing.Color.White;
            this.panel1.Controls.Add(this.rdbDelivery);
            this.panel1.Controls.Add(this.rdbPickup);
            this.panel1.Dock = System.Windows.Forms.DockStyle.Top;
            this.panel1.Location = new System.Drawing.Point(0, 0);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(442, 90);
            this.panel1.TabIndex = 2;
            // 
            // dtDeliveryRequestDate
            // 
            this.dtDeliveryRequestDate.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.dtDeliveryRequestDate.Location = new System.Drawing.Point(125, 18);
            this.dtDeliveryRequestDate.Name = "dtDeliveryRequestDate";
            this.dtDeliveryRequestDate.Size = new System.Drawing.Size(277, 27);
            this.dtDeliveryRequestDate.TabIndex = 3;
            // 
            // txtDeliveryNotes
            // 
            this.txtDeliveryNotes.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.txtDeliveryNotes.Font = new System.Drawing.Font("Tahoma", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtDeliveryNotes.Location = new System.Drawing.Point(125, 100);
            this.txtDeliveryNotes.Multiline = true;
            this.txtDeliveryNotes.Name = "txtDeliveryNotes";
            this.txtDeliveryNotes.Size = new System.Drawing.Size(277, 98);
            this.txtDeliveryNotes.TabIndex = 4;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.Location = new System.Drawing.Point(30, 100);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(89, 13);
            this.label1.TabIndex = 5;
            this.label1.Text = "Delivery Notes";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label2.Location = new System.Drawing.Point(42, 64);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(77, 13);
            this.label2.TabIndex = 6;
            this.label2.Text = "Delivery Fee";
            // 
            // label3
            // 
            this.label3.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label3.Location = new System.Drawing.Point(13, 18);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(106, 27);
            this.label3.TabIndex = 7;
            this.label3.Text = "Date Request for Delivery";
            this.label3.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // txtDeliveryFee
            // 
            this.txtDeliveryFee.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.txtDeliveryFee.Font = new System.Drawing.Font("Tahoma", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtDeliveryFee.Location = new System.Drawing.Point(125, 64);
            this.txtDeliveryFee.Name = "txtDeliveryFee";
            this.txtDeliveryFee.Size = new System.Drawing.Size(277, 30);
            this.txtDeliveryFee.TabIndex = 8;
            // 
            // panelDeliveryForm
            // 
            this.panelDeliveryForm.Controls.Add(this.dtDeliveryRequestDate);
            this.panelDeliveryForm.Controls.Add(this.txtDeliveryFee);
            this.panelDeliveryForm.Controls.Add(this.txtDeliveryNotes);
            this.panelDeliveryForm.Controls.Add(this.label3);
            this.panelDeliveryForm.Controls.Add(this.label1);
            this.panelDeliveryForm.Controls.Add(this.label2);
            this.panelDeliveryForm.Enabled = false;
            this.panelDeliveryForm.Location = new System.Drawing.Point(12, 108);
            this.panelDeliveryForm.Name = "panelDeliveryForm";
            this.panelDeliveryForm.Size = new System.Drawing.Size(418, 216);
            this.panelDeliveryForm.TabIndex = 9;
            this.panelDeliveryForm.Paint += new System.Windows.Forms.PaintEventHandler(this.panelDeliveryForm_Paint);
            // 
            // btnEnter
            // 
            this.btnEnter.BackColor = System.Drawing.SystemColors.HotTrack;
            this.btnEnter.FlatAppearance.BorderSize = 0;
            this.btnEnter.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnEnter.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnEnter.ForeColor = System.Drawing.Color.White;
            this.btnEnter.Location = new System.Drawing.Point(137, 330);
            this.btnEnter.Name = "btnEnter";
            this.btnEnter.Size = new System.Drawing.Size(293, 56);
            this.btnEnter.TabIndex = 10;
            this.btnEnter.Text = "Enter";
            this.btnEnter.UseVisualStyleBackColor = false;
            this.btnEnter.Click += new System.EventHandler(this.btnEnter_Click);
            // 
            // btnClose
            // 
            this.btnClose.BackColor = System.Drawing.Color.MistyRose;
            this.btnClose.FlatAppearance.BorderSize = 0;
            this.btnClose.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnClose.Location = new System.Drawing.Point(12, 330);
            this.btnClose.Name = "btnClose";
            this.btnClose.Size = new System.Drawing.Size(119, 56);
            this.btnClose.TabIndex = 11;
            this.btnClose.Text = "Cancel";
            this.btnClose.UseVisualStyleBackColor = false;
            this.btnClose.Click += new System.EventHandler(this.btnClose_Click);
            // 
            // frmShipment
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(442, 398);
            this.Controls.Add(this.btnClose);
            this.Controls.Add(this.btnEnter);
            this.Controls.Add(this.panelDeliveryForm);
            this.Controls.Add(this.panel1);
            this.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.KeyPreview = true;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "frmShipment";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Text = "Shipment";
            this.Load += new System.EventHandler(this.frmShipment_Load);
            this.KeyDown += new System.Windows.Forms.KeyEventHandler(this.frmShipment_KeyDown);
            this.panel1.ResumeLayout(false);
            this.panelDeliveryForm.ResumeLayout(false);
            this.panelDeliveryForm.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.RadioButton rdbPickup;
        private System.Windows.Forms.RadioButton rdbDelivery;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.DateTimePicker dtDeliveryRequestDate;
        private System.Windows.Forms.TextBox txtDeliveryNotes;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.TextBox txtDeliveryFee;
        private System.Windows.Forms.Panel panelDeliveryForm;
        private System.Windows.Forms.Button btnEnter;
        private System.Windows.Forms.Button btnClose;
    }
}