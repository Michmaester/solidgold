namespace MPOS.Forms
{
    partial class frmDailyClosing
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
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle5 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle2 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle3 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle4 = new System.Windows.Forms.DataGridViewCellStyle();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(frmDailyClosing));
            this.label1 = new System.Windows.Forms.Label();
            this.btnSave = new System.Windows.Forms.Button();
            this.button2 = new System.Windows.Forms.Button();
            this.label2 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.label5 = new System.Windows.Forms.Label();
            this.lblInitialAmount = new System.Windows.Forms.Label();
            this.lblTotalNetAccountability = new System.Windows.Forms.Label();
            this.lblShortOver = new System.Windows.Forms.Label();
            this.lblSalesCollection = new System.Windows.Forms.Label();
            this.lblDailyTransDate = new System.Windows.Forms.Label();
            this.dgvList = new System.Windows.Forms.DataGridView();
            this.PayType = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.CashQty = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Equivalent = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.panel1 = new System.Windows.Forms.Panel();
            this.label6 = new System.Windows.Forms.Label();
            this.txtDailyTotalExpense = new System.Windows.Forms.TextBox();
            ((System.ComponentModel.ISupportInitialize)(this.dgvList)).BeginInit();
            this.panel1.SuspendLayout();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.Location = new System.Drawing.Point(412, 132);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(150, 19);
            this.label1.TabIndex = 0;
            this.label1.Text = "Initial Cash Amount";
            // 
            // btnSave
            // 
            this.btnSave.BackColor = System.Drawing.SystemColors.HotTrack;
            this.btnSave.FlatAppearance.BorderSize = 0;
            this.btnSave.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnSave.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnSave.ForeColor = System.Drawing.Color.White;
            this.btnSave.Location = new System.Drawing.Point(583, 403);
            this.btnSave.Name = "btnSave";
            this.btnSave.Size = new System.Drawing.Size(171, 44);
            this.btnSave.TabIndex = 2;
            this.btnSave.Text = "Save";
            this.btnSave.UseVisualStyleBackColor = false;
            this.btnSave.Click += new System.EventHandler(this.btnSave_Click);
            // 
            // button2
            // 
            this.button2.BackColor = System.Drawing.Color.DarkGray;
            this.button2.FlatAppearance.BorderSize = 0;
            this.button2.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.button2.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.button2.ForeColor = System.Drawing.Color.White;
            this.button2.Location = new System.Drawing.Point(379, 403);
            this.button2.Name = "button2";
            this.button2.Size = new System.Drawing.Size(198, 44);
            this.button2.TabIndex = 3;
            this.button2.Text = "Print Daily Report";
            this.button2.UseVisualStyleBackColor = false;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label2.Location = new System.Drawing.Point(401, 198);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(161, 19);
            this.label2.TabIndex = 4;
            this.label2.Text = "Total Sales/Collection";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label3.Location = new System.Drawing.Point(463, 13);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(41, 19);
            this.label3.TabIndex = 5;
            this.label3.Text = "Date";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label4.Location = new System.Drawing.Point(384, 240);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(178, 19);
            this.label4.TabIndex = 6;
            this.label4.Text = "Total Net Accountability";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label5.Location = new System.Drawing.Point(413, 282);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(149, 19);
            this.label5.TabIndex = 7;
            this.label5.Text = "Short/Over Amount";
            // 
            // lblInitialAmount
            // 
            this.lblInitialAmount.BackColor = System.Drawing.Color.Silver;
            this.lblInitialAmount.Font = new System.Drawing.Font("Tahoma", 18F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblInitialAmount.Location = new System.Drawing.Point(568, 122);
            this.lblInitialAmount.Name = "lblInitialAmount";
            this.lblInitialAmount.Padding = new System.Windows.Forms.Padding(5);
            this.lblInitialAmount.Size = new System.Drawing.Size(186, 39);
            this.lblInitialAmount.TabIndex = 8;
            this.lblInitialAmount.Text = "0";
            this.lblInitialAmount.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // lblTotalNetAccountability
            // 
            this.lblTotalNetAccountability.BackColor = System.Drawing.Color.Silver;
            this.lblTotalNetAccountability.Font = new System.Drawing.Font("Tahoma", 18F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblTotalNetAccountability.Location = new System.Drawing.Point(568, 230);
            this.lblTotalNetAccountability.Name = "lblTotalNetAccountability";
            this.lblTotalNetAccountability.Padding = new System.Windows.Forms.Padding(5);
            this.lblTotalNetAccountability.Size = new System.Drawing.Size(186, 39);
            this.lblTotalNetAccountability.TabIndex = 9;
            this.lblTotalNetAccountability.Text = "0";
            this.lblTotalNetAccountability.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // lblShortOver
            // 
            this.lblShortOver.BackColor = System.Drawing.Color.Silver;
            this.lblShortOver.Font = new System.Drawing.Font("Tahoma", 18F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblShortOver.Location = new System.Drawing.Point(568, 272);
            this.lblShortOver.Name = "lblShortOver";
            this.lblShortOver.Padding = new System.Windows.Forms.Padding(5);
            this.lblShortOver.Size = new System.Drawing.Size(186, 39);
            this.lblShortOver.TabIndex = 10;
            this.lblShortOver.Text = "0";
            this.lblShortOver.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // lblSalesCollection
            // 
            this.lblSalesCollection.BackColor = System.Drawing.Color.Silver;
            this.lblSalesCollection.Font = new System.Drawing.Font("Tahoma", 18F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblSalesCollection.Location = new System.Drawing.Point(568, 188);
            this.lblSalesCollection.Name = "lblSalesCollection";
            this.lblSalesCollection.Padding = new System.Windows.Forms.Padding(5);
            this.lblSalesCollection.Size = new System.Drawing.Size(186, 39);
            this.lblSalesCollection.TabIndex = 11;
            this.lblSalesCollection.Text = "0";
            this.lblSalesCollection.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // lblDailyTransDate
            // 
            this.lblDailyTransDate.BackColor = System.Drawing.Color.Silver;
            this.lblDailyTransDate.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblDailyTransDate.Location = new System.Drawing.Point(510, 3);
            this.lblDailyTransDate.Name = "lblDailyTransDate";
            this.lblDailyTransDate.Padding = new System.Windows.Forms.Padding(5);
            this.lblDailyTransDate.Size = new System.Drawing.Size(244, 39);
            this.lblDailyTransDate.TabIndex = 12;
            this.lblDailyTransDate.Text = "-";
            this.lblDailyTransDate.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // dgvList
            // 
            this.dgvList.AllowUserToAddRows = false;
            this.dgvList.AllowUserToDeleteRows = false;
            this.dgvList.AllowUserToResizeColumns = false;
            this.dgvList.AllowUserToResizeRows = false;
            this.dgvList.BackgroundColor = System.Drawing.Color.White;
            this.dgvList.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.dgvList.ColumnHeadersBorderStyle = System.Windows.Forms.DataGridViewHeaderBorderStyle.Single;
            dataGridViewCellStyle1.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle1.BackColor = System.Drawing.Color.DimGray;
            dataGridViewCellStyle1.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle1.ForeColor = System.Drawing.Color.White;
            dataGridViewCellStyle1.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle1.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle1.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.dgvList.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle1;
            this.dgvList.ColumnHeadersHeight = 40;
            this.dgvList.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.DisableResizing;
            this.dgvList.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.PayType,
            this.CashQty,
            this.Equivalent});
            this.dgvList.EnableHeadersVisualStyles = false;
            this.dgvList.Location = new System.Drawing.Point(3, 3);
            this.dgvList.MultiSelect = false;
            this.dgvList.Name = "dgvList";
            this.dgvList.RowHeadersBorderStyle = System.Windows.Forms.DataGridViewHeaderBorderStyle.None;
            dataGridViewCellStyle5.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle5.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle5.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle5.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle5.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle5.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.dgvList.RowHeadersDefaultCellStyle = dataGridViewCellStyle5;
            this.dgvList.RowHeadersVisible = false;
            this.dgvList.RowTemplate.DefaultCellStyle.Font = new System.Drawing.Font("Tahoma", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.dgvList.RowTemplate.Height = 25;
            this.dgvList.RowTemplate.Resizable = System.Windows.Forms.DataGridViewTriState.False;
            this.dgvList.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.CellSelect;
            this.dgvList.Size = new System.Drawing.Size(370, 444);
            this.dgvList.TabIndex = 13;
            this.dgvList.CellClick += new System.Windows.Forms.DataGridViewCellEventHandler(this.dgvList_CellClick);
            this.dgvList.CellEndEdit += new System.Windows.Forms.DataGridViewCellEventHandler(this.dgvList_CellEndEdit);
            // 
            // PayType
            // 
            dataGridViewCellStyle2.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle2.ForeColor = System.Drawing.SystemColors.HotTrack;
            dataGridViewCellStyle2.Padding = new System.Windows.Forms.Padding(5, 0, 0, 0);
            this.PayType.DefaultCellStyle = dataGridViewCellStyle2;
            this.PayType.HeaderText = "Payment Type / Amount";
            this.PayType.Name = "PayType";
            this.PayType.ReadOnly = true;
            this.PayType.Width = 150;
            // 
            // CashQty
            // 
            dataGridViewCellStyle3.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle3.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle3.Padding = new System.Windows.Forms.Padding(5, 0, 0, 0);
            this.CashQty.DefaultCellStyle = dataGridViewCellStyle3;
            this.CashQty.HeaderText = "Cash Qty.";
            this.CashQty.Name = "CashQty";
            this.CashQty.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            // 
            // Equivalent
            // 
            this.Equivalent.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.Fill;
            dataGridViewCellStyle4.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle4.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle4.Padding = new System.Windows.Forms.Padding(5, 0, 0, 0);
            this.Equivalent.DefaultCellStyle = dataGridViewCellStyle4;
            this.Equivalent.HeaderText = "Equivalent";
            this.Equivalent.Name = "Equivalent";
            this.Equivalent.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            // 
            // panel1
            // 
            this.panel1.Controls.Add(this.txtDailyTotalExpense);
            this.panel1.Controls.Add(this.label6);
            this.panel1.Controls.Add(this.dgvList);
            this.panel1.Controls.Add(this.lblDailyTransDate);
            this.panel1.Controls.Add(this.lblSalesCollection);
            this.panel1.Controls.Add(this.label1);
            this.panel1.Controls.Add(this.lblShortOver);
            this.panel1.Controls.Add(this.btnSave);
            this.panel1.Controls.Add(this.lblTotalNetAccountability);
            this.panel1.Controls.Add(this.button2);
            this.panel1.Controls.Add(this.lblInitialAmount);
            this.panel1.Controls.Add(this.label2);
            this.panel1.Controls.Add(this.label5);
            this.panel1.Controls.Add(this.label3);
            this.panel1.Controls.Add(this.label4);
            this.panel1.Location = new System.Drawing.Point(12, 12);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(765, 459);
            this.panel1.TabIndex = 14;
            this.panel1.Paint += new System.Windows.Forms.PaintEventHandler(this.panel1_Paint);
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label6.Location = new System.Drawing.Point(412, 90);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(148, 19);
            this.label6.TabIndex = 14;
            this.label6.Text = "Daily Total Expense";
            // 
            // txtDailyTotalExpense
            // 
            this.txtDailyTotalExpense.Font = new System.Drawing.Font("Tahoma", 18F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtDailyTotalExpense.ForeColor = System.Drawing.SystemColors.HotTrack;
            this.txtDailyTotalExpense.Location = new System.Drawing.Point(568, 79);
            this.txtDailyTotalExpense.Name = "txtDailyTotalExpense";
            this.txtDailyTotalExpense.Size = new System.Drawing.Size(186, 36);
            this.txtDailyTotalExpense.TabIndex = 16;
            this.txtDailyTotalExpense.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.txtDailyTotalExpense.TextChanged += new System.EventHandler(this.txtDailyTotalExpense_TextChanged);
            // 
            // frmDailyClosing
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(781, 472);
            this.Controls.Add(this.panel1);
            this.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "frmDailyClosing";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Text = "Daily Closing";
            this.Load += new System.EventHandler(this.frmDailyClosing_Load);
            ((System.ComponentModel.ISupportInitialize)(this.dgvList)).EndInit();
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Button btnSave;
        private System.Windows.Forms.Button button2;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Label lblInitialAmount;
        private System.Windows.Forms.Label lblTotalNetAccountability;
        private System.Windows.Forms.Label lblShortOver;
        private System.Windows.Forms.Label lblSalesCollection;
        private System.Windows.Forms.Label lblDailyTransDate;
        private System.Windows.Forms.DataGridView dgvList;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.DataGridViewTextBoxColumn PayType;
        private System.Windows.Forms.DataGridViewTextBoxColumn CashQty;
        private System.Windows.Forms.DataGridViewTextBoxColumn Equivalent;
        private System.Windows.Forms.TextBox txtDailyTotalExpense;
        private System.Windows.Forms.Label label6;
    }
}