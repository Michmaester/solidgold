namespace MPOS.Forms
{
    partial class frmPayment
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
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle1 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle3 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle2 = new System.Windows.Forms.DataGridViewCellStyle();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(frmPayment));
            this.btnBack = new System.Windows.Forms.Button();
            this.btnSubmit = new System.Windows.Forms.Button();
            this.btnRemovePayment = new System.Windows.Forms.Button();
            this.btnResetPayment = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.lblBalanceRemaining = new System.Windows.Forms.Label();
            this.lblTotalAmountDue = new System.Windows.Forms.Label();
            this.lblTotalAmountPaid = new System.Windows.Forms.Label();
            this.lblBalancePaid = new System.Windows.Forms.Label();
            this.label8 = new System.Windows.Forms.Label();
            this.label9 = new System.Windows.Forms.Label();
            this.dgvPayments = new System.Windows.Forms.DataGridView();
            this.Column1 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Column4 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Column5 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.panelPaymentForm = new System.Windows.Forms.Panel();
            this.label4 = new System.Windows.Forms.Label();
            this.rdbPaymentCash = new System.Windows.Forms.RadioButton();
            this.rdbCreditCard = new System.Windows.Forms.RadioButton();
            this.rdbCheque = new System.Windows.Forms.RadioButton();
            this.rdbCharge = new System.Windows.Forms.RadioButton();
            this.panel1 = new System.Windows.Forms.Panel();
            this.lblChangeAmount = new System.Windows.Forms.Label();
            this.label5 = new System.Windows.Forms.Label();
            this.panel2 = new System.Windows.Forms.Panel();
            this.lblCustomerName = new System.Windows.Forms.Label();
            this.cbDeduct1Perc = new System.Windows.Forms.CheckBox();
            ((System.ComponentModel.ISupportInitialize)(this.dgvPayments)).BeginInit();
            this.panel1.SuspendLayout();
            this.panel2.SuspendLayout();
            this.SuspendLayout();
            // 
            // btnBack
            // 
            this.btnBack.BackColor = System.Drawing.Color.MistyRose;
            this.btnBack.FlatAppearance.BorderColor = System.Drawing.Color.White;
            this.btnBack.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnBack.Location = new System.Drawing.Point(12, 537);
            this.btnBack.Name = "btnBack";
            this.btnBack.Size = new System.Drawing.Size(128, 50);
            this.btnBack.TabIndex = 4;
            this.btnBack.Text = "Back";
            this.btnBack.UseVisualStyleBackColor = false;
            this.btnBack.Click += new System.EventHandler(this.btnBack_Click);
            // 
            // btnSubmit
            // 
            this.btnSubmit.BackColor = System.Drawing.SystemColors.HotTrack;
            this.btnSubmit.FlatAppearance.BorderColor = System.Drawing.Color.White;
            this.btnSubmit.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnSubmit.Font = new System.Drawing.Font("Tahoma", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnSubmit.ForeColor = System.Drawing.Color.White;
            this.btnSubmit.Location = new System.Drawing.Point(725, 537);
            this.btnSubmit.Name = "btnSubmit";
            this.btnSubmit.Size = new System.Drawing.Size(394, 50);
            this.btnSubmit.TabIndex = 5;
            this.btnSubmit.Text = "SUBMIT PAYMENT";
            this.btnSubmit.UseVisualStyleBackColor = false;
            this.btnSubmit.Click += new System.EventHandler(this.btnSubmit_Click);
            // 
            // btnRemovePayment
            // 
            this.btnRemovePayment.BackColor = System.Drawing.Color.MistyRose;
            this.btnRemovePayment.FlatAppearance.BorderColor = System.Drawing.Color.White;
            this.btnRemovePayment.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnRemovePayment.Location = new System.Drawing.Point(319, 537);
            this.btnRemovePayment.Name = "btnRemovePayment";
            this.btnRemovePayment.Size = new System.Drawing.Size(111, 50);
            this.btnRemovePayment.TabIndex = 6;
            this.btnRemovePayment.Text = "Remove";
            this.btnRemovePayment.UseVisualStyleBackColor = false;
            this.btnRemovePayment.Click += new System.EventHandler(this.btnRemovePayment_Click);
            // 
            // btnResetPayment
            // 
            this.btnResetPayment.BackColor = System.Drawing.Color.MistyRose;
            this.btnResetPayment.FlatAppearance.BorderColor = System.Drawing.Color.White;
            this.btnResetPayment.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnResetPayment.Location = new System.Drawing.Point(202, 537);
            this.btnResetPayment.Name = "btnResetPayment";
            this.btnResetPayment.Size = new System.Drawing.Size(111, 50);
            this.btnResetPayment.TabIndex = 7;
            this.btnResetPayment.Text = "Reset Payments";
            this.btnResetPayment.UseVisualStyleBackColor = false;
            this.btnResetPayment.Click += new System.EventHandler(this.btnResetPayment_Click);
            // 
            // label1
            // 
            this.label1.BackColor = System.Drawing.Color.White;
            this.label1.Font = new System.Drawing.Font("Tahoma", 21.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.ForeColor = System.Drawing.SystemColors.HotTrack;
            this.label1.Location = new System.Drawing.Point(0, 0);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(362, 72);
            this.label1.TabIndex = 8;
            this.label1.Text = "TOTAL AMOUNT DUE";
            this.label1.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Tahoma", 21.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label2.Location = new System.Drawing.Point(56, 91);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(306, 35);
            this.label2.TabIndex = 9;
            this.label2.Text = "Total Amount Paid :";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Tahoma", 21.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label3.ForeColor = System.Drawing.Color.Red;
            this.label3.Location = new System.Drawing.Point(141, 126);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(221, 35);
            this.label3.TabIndex = 10;
            this.label3.Text = "Balance Paid :";
            // 
            // lblBalanceRemaining
            // 
            this.lblBalanceRemaining.AutoSize = true;
            this.lblBalanceRemaining.Font = new System.Drawing.Font("Tahoma", 21.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblBalanceRemaining.ForeColor = System.Drawing.Color.Red;
            this.lblBalanceRemaining.Location = new System.Drawing.Point(402, 161);
            this.lblBalanceRemaining.Name = "lblBalanceRemaining";
            this.lblBalanceRemaining.Size = new System.Drawing.Size(33, 35);
            this.lblBalanceRemaining.TabIndex = 11;
            this.lblBalanceRemaining.Text = "0";
            // 
            // lblTotalAmountDue
            // 
            this.lblTotalAmountDue.BackColor = System.Drawing.Color.Gainsboro;
            this.lblTotalAmountDue.Font = new System.Drawing.Font("Tahoma", 24F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblTotalAmountDue.ForeColor = System.Drawing.SystemColors.InfoText;
            this.lblTotalAmountDue.Location = new System.Drawing.Point(361, 0);
            this.lblTotalAmountDue.Name = "lblTotalAmountDue";
            this.lblTotalAmountDue.Size = new System.Drawing.Size(322, 72);
            this.lblTotalAmountDue.TabIndex = 12;
            this.lblTotalAmountDue.Text = "0.00";
            this.lblTotalAmountDue.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lblTotalAmountPaid
            // 
            this.lblTotalAmountPaid.AutoSize = true;
            this.lblTotalAmountPaid.Font = new System.Drawing.Font("Tahoma", 21.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblTotalAmountPaid.Location = new System.Drawing.Point(402, 91);
            this.lblTotalAmountPaid.Name = "lblTotalAmountPaid";
            this.lblTotalAmountPaid.Size = new System.Drawing.Size(33, 35);
            this.lblTotalAmountPaid.TabIndex = 13;
            this.lblTotalAmountPaid.Text = "0";
            // 
            // lblBalancePaid
            // 
            this.lblBalancePaid.AutoSize = true;
            this.lblBalancePaid.Font = new System.Drawing.Font("Tahoma", 21.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblBalancePaid.ForeColor = System.Drawing.Color.Red;
            this.lblBalancePaid.Location = new System.Drawing.Point(402, 126);
            this.lblBalancePaid.Name = "lblBalancePaid";
            this.lblBalancePaid.Size = new System.Drawing.Size(33, 35);
            this.lblBalancePaid.TabIndex = 14;
            this.lblBalancePaid.Text = "0";
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Font = new System.Drawing.Font("Tahoma", 21.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label8.ForeColor = System.Drawing.Color.Red;
            this.label8.Location = new System.Drawing.Point(47, 161);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(315, 35);
            this.label8.TabIndex = 15;
            this.label8.Text = "Balance Remaining :";
            // 
            // label9
            // 
            this.label9.BackColor = System.Drawing.SystemColors.HotTrack;
            this.label9.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label9.ForeColor = System.Drawing.Color.White;
            this.label9.Location = new System.Drawing.Point(10, 9);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(169, 36);
            this.label9.TabIndex = 17;
            this.label9.Text = "CUSTOMER NAME";
            this.label9.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // dgvPayments
            // 
            this.dgvPayments.AllowUserToAddRows = false;
            this.dgvPayments.AllowUserToDeleteRows = false;
            this.dgvPayments.AllowUserToResizeColumns = false;
            this.dgvPayments.AllowUserToResizeRows = false;
            this.dgvPayments.BackgroundColor = System.Drawing.Color.White;
            this.dgvPayments.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.dgvPayments.ColumnHeadersBorderStyle = System.Windows.Forms.DataGridViewHeaderBorderStyle.Single;
            dataGridViewCellStyle1.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle1.BackColor = System.Drawing.Color.DimGray;
            dataGridViewCellStyle1.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle1.ForeColor = System.Drawing.Color.White;
            dataGridViewCellStyle1.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle1.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle1.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.dgvPayments.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle1;
            this.dgvPayments.ColumnHeadersHeight = 40;
            this.dgvPayments.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.DisableResizing;
            this.dgvPayments.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.Column1,
            this.Column4,
            this.Column5});
            this.dgvPayments.EnableHeadersVisualStyles = false;
            this.dgvPayments.Location = new System.Drawing.Point(436, 324);
            this.dgvPayments.Name = "dgvPayments";
            this.dgvPayments.ReadOnly = true;
            this.dgvPayments.RowHeadersBorderStyle = System.Windows.Forms.DataGridViewHeaderBorderStyle.None;
            dataGridViewCellStyle3.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle3.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle3.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle3.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle3.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle3.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.dgvPayments.RowHeadersDefaultCellStyle = dataGridViewCellStyle3;
            this.dgvPayments.RowHeadersVisible = false;
            this.dgvPayments.RowTemplate.DefaultCellStyle.Font = new System.Drawing.Font("Tahoma", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.dgvPayments.RowTemplate.Height = 30;
            this.dgvPayments.RowTemplate.Resizable = System.Windows.Forms.DataGridViewTriState.False;
            this.dgvPayments.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.dgvPayments.Size = new System.Drawing.Size(683, 207);
            this.dgvPayments.TabIndex = 18;
            this.dgvPayments.CellClick += new System.Windows.Forms.DataGridViewCellEventHandler(this.dgvPayments_CellClick);
            // 
            // Column1
            // 
            this.Column1.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.Fill;
            dataGridViewCellStyle2.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.Column1.DefaultCellStyle = dataGridViewCellStyle2;
            this.Column1.HeaderText = "Payment Type";
            this.Column1.Name = "Column1";
            this.Column1.ReadOnly = true;
            this.Column1.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            // 
            // Column4
            // 
            this.Column4.HeaderText = "Amount";
            this.Column4.Name = "Column4";
            this.Column4.ReadOnly = true;
            this.Column4.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            this.Column4.Width = 200;
            // 
            // Column5
            // 
            this.Column5.HeaderText = "Tendered";
            this.Column5.Name = "Column5";
            this.Column5.ReadOnly = true;
            this.Column5.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            this.Column5.Width = 200;
            // 
            // panelPaymentForm
            // 
            this.panelPaymentForm.Location = new System.Drawing.Point(12, 158);
            this.panelPaymentForm.Name = "panelPaymentForm";
            this.panelPaymentForm.Size = new System.Drawing.Size(418, 373);
            this.panelPaymentForm.TabIndex = 19;
            // 
            // label4
            // 
            this.label4.BackColor = System.Drawing.Color.White;
            this.label4.Font = new System.Drawing.Font("Tahoma", 21.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label4.ForeColor = System.Drawing.SystemColors.HotTrack;
            this.label4.Location = new System.Drawing.Point(12, 12);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(418, 72);
            this.label4.TabIndex = 20;
            this.label4.Text = "PAYMENT METHODS";
            this.label4.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // rdbPaymentCash
            // 
            this.rdbPaymentCash.Appearance = System.Windows.Forms.Appearance.Button;
            this.rdbPaymentCash.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rdbPaymentCash.ForeColor = System.Drawing.SystemColors.HotTrack;
            this.rdbPaymentCash.Image = ((System.Drawing.Image)(resources.GetObject("rdbPaymentCash.Image")));
            this.rdbPaymentCash.Location = new System.Drawing.Point(12, 89);
            this.rdbPaymentCash.Name = "rdbPaymentCash";
            this.rdbPaymentCash.Size = new System.Drawing.Size(100, 65);
            this.rdbPaymentCash.TabIndex = 21;
            this.rdbPaymentCash.TabStop = true;
            this.rdbPaymentCash.Text = "Cash";
            this.rdbPaymentCash.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.rdbPaymentCash.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.rdbPaymentCash.UseVisualStyleBackColor = true;
            this.rdbPaymentCash.CheckedChanged += new System.EventHandler(this.rdbPaymentCash_CheckedChanged);
            // 
            // rdbCreditCard
            // 
            this.rdbCreditCard.Appearance = System.Windows.Forms.Appearance.Button;
            this.rdbCreditCard.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rdbCreditCard.ForeColor = System.Drawing.SystemColors.HotTrack;
            this.rdbCreditCard.Image = ((System.Drawing.Image)(resources.GetObject("rdbCreditCard.Image")));
            this.rdbCreditCard.Location = new System.Drawing.Point(118, 89);
            this.rdbCreditCard.Name = "rdbCreditCard";
            this.rdbCreditCard.Size = new System.Drawing.Size(100, 65);
            this.rdbCreditCard.TabIndex = 22;
            this.rdbCreditCard.TabStop = true;
            this.rdbCreditCard.Text = "Credit Card";
            this.rdbCreditCard.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.rdbCreditCard.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.rdbCreditCard.UseVisualStyleBackColor = true;
            this.rdbCreditCard.CheckedChanged += new System.EventHandler(this.rdbCreditCard_CheckedChanged);
            // 
            // rdbCheque
            // 
            this.rdbCheque.Appearance = System.Windows.Forms.Appearance.Button;
            this.rdbCheque.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rdbCheque.ForeColor = System.Drawing.SystemColors.HotTrack;
            this.rdbCheque.Image = ((System.Drawing.Image)(resources.GetObject("rdbCheque.Image")));
            this.rdbCheque.Location = new System.Drawing.Point(224, 89);
            this.rdbCheque.Name = "rdbCheque";
            this.rdbCheque.Size = new System.Drawing.Size(100, 65);
            this.rdbCheque.TabIndex = 23;
            this.rdbCheque.TabStop = true;
            this.rdbCheque.Text = "Cheque";
            this.rdbCheque.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.rdbCheque.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.rdbCheque.UseVisualStyleBackColor = true;
            this.rdbCheque.CheckedChanged += new System.EventHandler(this.rdbCheque_CheckedChanged);
            // 
            // rdbCharge
            // 
            this.rdbCharge.Appearance = System.Windows.Forms.Appearance.Button;
            this.rdbCharge.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rdbCharge.ForeColor = System.Drawing.SystemColors.HotTrack;
            this.rdbCharge.Image = ((System.Drawing.Image)(resources.GetObject("rdbCharge.Image")));
            this.rdbCharge.Location = new System.Drawing.Point(330, 89);
            this.rdbCharge.Name = "rdbCharge";
            this.rdbCharge.Size = new System.Drawing.Size(100, 65);
            this.rdbCharge.TabIndex = 24;
            this.rdbCharge.TabStop = true;
            this.rdbCharge.Text = "Charge";
            this.rdbCharge.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.rdbCharge.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.rdbCharge.UseVisualStyleBackColor = true;
            this.rdbCharge.CheckedChanged += new System.EventHandler(this.rdbCharge_CheckedChanged);
            // 
            // panel1
            // 
            this.panel1.BackColor = System.Drawing.Color.White;
            this.panel1.Controls.Add(this.lblChangeAmount);
            this.panel1.Controls.Add(this.label5);
            this.panel1.Controls.Add(this.label1);
            this.panel1.Controls.Add(this.label2);
            this.panel1.Controls.Add(this.label3);
            this.panel1.Controls.Add(this.lblBalanceRemaining);
            this.panel1.Controls.Add(this.lblTotalAmountDue);
            this.panel1.Controls.Add(this.lblTotalAmountPaid);
            this.panel1.Controls.Add(this.lblBalancePaid);
            this.panel1.Controls.Add(this.label8);
            this.panel1.Location = new System.Drawing.Point(436, 12);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(683, 260);
            this.panel1.TabIndex = 25;
            // 
            // lblChangeAmount
            // 
            this.lblChangeAmount.AutoSize = true;
            this.lblChangeAmount.Font = new System.Drawing.Font("Tahoma", 21.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblChangeAmount.ForeColor = System.Drawing.Color.Red;
            this.lblChangeAmount.Location = new System.Drawing.Point(402, 196);
            this.lblChangeAmount.Name = "lblChangeAmount";
            this.lblChangeAmount.Size = new System.Drawing.Size(33, 35);
            this.lblChangeAmount.TabIndex = 17;
            this.lblChangeAmount.Text = "0";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Font = new System.Drawing.Font("Tahoma", 21.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label5.ForeColor = System.Drawing.Color.Red;
            this.label5.Location = new System.Drawing.Point(218, 196);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(144, 35);
            this.label5.TabIndex = 16;
            this.label5.Text = "Change :";
            // 
            // panel2
            // 
            this.panel2.BackColor = System.Drawing.Color.Gainsboro;
            this.panel2.Controls.Add(this.lblCustomerName);
            this.panel2.Controls.Add(this.label9);
            this.panel2.Location = new System.Drawing.Point(436, 270);
            this.panel2.Name = "panel2";
            this.panel2.Size = new System.Drawing.Size(683, 55);
            this.panel2.TabIndex = 26;
            // 
            // lblCustomerName
            // 
            this.lblCustomerName.Font = new System.Drawing.Font("Tahoma", 15.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblCustomerName.ForeColor = System.Drawing.SystemColors.HotTrack;
            this.lblCustomerName.Location = new System.Drawing.Point(185, 9);
            this.lblCustomerName.Name = "lblCustomerName";
            this.lblCustomerName.Size = new System.Drawing.Size(483, 36);
            this.lblCustomerName.TabIndex = 18;
            this.lblCustomerName.Text = "-";
            this.lblCustomerName.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // cbDeduct1Perc
            // 
            this.cbDeduct1Perc.BackColor = System.Drawing.Color.LightCoral;
            this.cbDeduct1Perc.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.cbDeduct1Perc.Font = new System.Drawing.Font("Tahoma", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.cbDeduct1Perc.ForeColor = System.Drawing.Color.White;
            this.cbDeduct1Perc.Location = new System.Drawing.Point(550, 538);
            this.cbDeduct1Perc.Name = "cbDeduct1Perc";
            this.cbDeduct1Perc.Padding = new System.Windows.Forms.Padding(10);
            this.cbDeduct1Perc.Size = new System.Drawing.Size(169, 49);
            this.cbDeduct1Perc.TabIndex = 18;
            this.cbDeduct1Perc.Text = "DEDUCT 1%";
            this.cbDeduct1Perc.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            this.cbDeduct1Perc.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageBeforeText;
            this.cbDeduct1Perc.UseVisualStyleBackColor = false;
            this.cbDeduct1Perc.CheckedChanged += new System.EventHandler(this.cbDeduct1Perc_CheckedChanged);
            // 
            // frmPayment
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1131, 595);
            this.Controls.Add(this.cbDeduct1Perc);
            this.Controls.Add(this.panel2);
            this.Controls.Add(this.panel1);
            this.Controls.Add(this.rdbCharge);
            this.Controls.Add(this.rdbCheque);
            this.Controls.Add(this.rdbCreditCard);
            this.Controls.Add(this.rdbPaymentCash);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.panelPaymentForm);
            this.Controls.Add(this.dgvPayments);
            this.Controls.Add(this.btnResetPayment);
            this.Controls.Add(this.btnRemovePayment);
            this.Controls.Add(this.btnSubmit);
            this.Controls.Add(this.btnBack);
            this.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.KeyPreview = true;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "frmPayment";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Text = "Payment Form";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.frmPayment_FormClosing);
            this.FormClosed += new System.Windows.Forms.FormClosedEventHandler(this.frmPayment_FormClosed);
            this.Load += new System.EventHandler(this.frmPayment_Load);
            this.KeyDown += new System.Windows.Forms.KeyEventHandler(this.frmPayment_KeyDown);
            ((System.ComponentModel.ISupportInitialize)(this.dgvPayments)).EndInit();
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            this.panel2.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion
        private System.Windows.Forms.Button btnBack;
        private System.Windows.Forms.Button btnSubmit;
        private System.Windows.Forms.Button btnRemovePayment;
        private System.Windows.Forms.Button btnResetPayment;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label lblBalanceRemaining;
        private System.Windows.Forms.Label lblTotalAmountDue;
        private System.Windows.Forms.Label lblTotalAmountPaid;
        private System.Windows.Forms.Label lblBalancePaid;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.DataGridView dgvPayments;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column1;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column4;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column5;
        private System.Windows.Forms.Panel panelPaymentForm;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.RadioButton rdbPaymentCash;
        private System.Windows.Forms.RadioButton rdbCreditCard;
        private System.Windows.Forms.RadioButton rdbCheque;
        private System.Windows.Forms.RadioButton rdbCharge;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.Panel panel2;
        private System.Windows.Forms.Label lblChangeAmount;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Label lblCustomerName;
        private System.Windows.Forms.CheckBox cbDeduct1Perc;
    }
}