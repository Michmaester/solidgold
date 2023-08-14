namespace MPOS
{
    partial class frmOrders
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
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle13 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle15 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle14 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle16 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle18 = new System.Windows.Forms.DataGridViewCellStyle();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle17 = new System.Windows.Forms.DataGridViewCellStyle();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(frmOrders));
            this.dgvSalesOrders = new System.Windows.Forms.DataGridView();
            this.Column1 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Column4 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Column5 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Column2 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Column3 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.label1 = new System.Windows.Forms.Label();
            this.dgvSalesOrderItems = new System.Windows.Forms.DataGridView();
            this.Column8 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.dataGridViewTextBoxColumn1 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.dataGridViewTextBoxColumn2 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.dataGridViewTextBoxColumn3 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.dataGridViewTextBoxColumn4 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.dataGridViewTextBoxColumn5 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Column6 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Column7 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Column9 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Column10 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Column11 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.label2 = new System.Windows.Forms.Label();
            this.btnPrintReceipt = new System.Windows.Forms.Button();
            this.btnPrint = new System.Windows.Forms.Button();
            this.btnChangeQty = new System.Windows.Forms.Button();
            this.btnPayment = new System.Windows.Forms.Button();
            this.btnBigPrint = new System.Windows.Forms.Button();
            this.btnRemoveItem = new System.Windows.Forms.Button();
            this.btnChangePrice = new System.Windows.Forms.Button();
            this.BtnDiscount = new System.Windows.Forms.Button();
            this.btnCancelOrder = new System.Windows.Forms.Button();
            this.panelOrderToolbar = new System.Windows.Forms.Panel();
            this.btnShipment = new System.Windows.Forms.Button();
            this.btnSalesType = new System.Windows.Forms.Button();
            this.btnClosing = new System.Windows.Forms.Button();
            this.lblTotalAmountDue = new System.Windows.Forms.Label();
            this.label7 = new System.Windows.Forms.Label();
            this.lblTotalDiscount = new System.Windows.Forms.Label();
            this.label5 = new System.Windows.Forms.Label();
            this.lblTotalItems = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.panel10 = new System.Windows.Forms.Panel();
            this.btnRefreshData = new System.Windows.Forms.Button();
            this.tmrData = new System.Windows.Forms.Timer(this.components);
            this.panel8 = new System.Windows.Forms.Panel();
            this.lblDeliveryFee = new System.Windows.Forms.Label();
            this.label8 = new System.Windows.Forms.Label();
            this.panel11 = new System.Windows.Forms.Panel();
            this.label4 = new System.Windows.Forms.Label();
            this.panel1 = new System.Windows.Forms.Panel();
            this.panel4 = new System.Windows.Forms.Panel();
            this.panel3 = new System.Windows.Forms.Panel();
            this.panel7 = new System.Windows.Forms.Panel();
            this.btnChangeDate = new System.Windows.Forms.Button();
            this.dtOrderDate = new System.Windows.Forms.DateTimePicker();
            this.panel2 = new System.Windows.Forms.Panel();
            this.panel6 = new System.Windows.Forms.Panel();
            this.panel5 = new System.Windows.Forms.Panel();
            this.btnManualRefresh = new System.Windows.Forms.Button();
            this.btnStopRefresh = new System.Windows.Forms.Button();
            this.panel9 = new System.Windows.Forms.Panel();
            this.lblDataRefreshNote = new System.Windows.Forms.Label();
            ((System.ComponentModel.ISupportInitialize)(this.dgvSalesOrders)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.dgvSalesOrderItems)).BeginInit();
            this.panelOrderToolbar.SuspendLayout();
            this.panel10.SuspendLayout();
            this.panel8.SuspendLayout();
            this.panel11.SuspendLayout();
            this.panel1.SuspendLayout();
            this.panel4.SuspendLayout();
            this.panel3.SuspendLayout();
            this.panel7.SuspendLayout();
            this.panel2.SuspendLayout();
            this.panel6.SuspendLayout();
            this.panel5.SuspendLayout();
            this.panel9.SuspendLayout();
            this.SuspendLayout();
            // 
            // dgvSalesOrders
            // 
            this.dgvSalesOrders.AllowUserToAddRows = false;
            this.dgvSalesOrders.AllowUserToDeleteRows = false;
            this.dgvSalesOrders.AllowUserToResizeColumns = false;
            this.dgvSalesOrders.AllowUserToResizeRows = false;
            this.dgvSalesOrders.BackgroundColor = System.Drawing.Color.White;
            this.dgvSalesOrders.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.dgvSalesOrders.ColumnHeadersBorderStyle = System.Windows.Forms.DataGridViewHeaderBorderStyle.Single;
            dataGridViewCellStyle13.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle13.BackColor = System.Drawing.Color.DimGray;
            dataGridViewCellStyle13.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle13.ForeColor = System.Drawing.Color.White;
            dataGridViewCellStyle13.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle13.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle13.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.dgvSalesOrders.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle13;
            this.dgvSalesOrders.ColumnHeadersHeight = 40;
            this.dgvSalesOrders.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.DisableResizing;
            this.dgvSalesOrders.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.Column1,
            this.Column4,
            this.Column5,
            this.Column2,
            this.Column3});
            this.dgvSalesOrders.Dock = System.Windows.Forms.DockStyle.Fill;
            this.dgvSalesOrders.EnableHeadersVisualStyles = false;
            this.dgvSalesOrders.Location = new System.Drawing.Point(10, 0);
            this.dgvSalesOrders.Margin = new System.Windows.Forms.Padding(3, 0, 3, 3);
            this.dgvSalesOrders.MultiSelect = false;
            this.dgvSalesOrders.Name = "dgvSalesOrders";
            this.dgvSalesOrders.ReadOnly = true;
            this.dgvSalesOrders.RowHeadersBorderStyle = System.Windows.Forms.DataGridViewHeaderBorderStyle.None;
            dataGridViewCellStyle15.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle15.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle15.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle15.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle15.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle15.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.dgvSalesOrders.RowHeadersDefaultCellStyle = dataGridViewCellStyle15;
            this.dgvSalesOrders.RowHeadersVisible = false;
            this.dgvSalesOrders.RowTemplate.DefaultCellStyle.Font = new System.Drawing.Font("Tahoma", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.dgvSalesOrders.RowTemplate.Height = 30;
            this.dgvSalesOrders.RowTemplate.Resizable = System.Windows.Forms.DataGridViewTriState.False;
            this.dgvSalesOrders.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.dgvSalesOrders.Size = new System.Drawing.Size(1330, 199);
            this.dgvSalesOrders.TabIndex = 0;
            this.dgvSalesOrders.CellClick += new System.Windows.Forms.DataGridViewCellEventHandler(this.dgvSalesOrders_CellClick);
            // 
            // Column1
            // 
            this.Column1.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.Fill;
            dataGridViewCellStyle14.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.Column1.DefaultCellStyle = dataGridViewCellStyle14;
            this.Column1.HeaderText = "Customer";
            this.Column1.Name = "Column1";
            this.Column1.ReadOnly = true;
            this.Column1.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            // 
            // Column4
            // 
            this.Column4.HeaderText = "Order Date";
            this.Column4.Name = "Column4";
            this.Column4.ReadOnly = true;
            this.Column4.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            this.Column4.Width = 200;
            // 
            // Column5
            // 
            this.Column5.HeaderText = "Order No.";
            this.Column5.Name = "Column5";
            this.Column5.ReadOnly = true;
            this.Column5.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            this.Column5.Width = 200;
            // 
            // Column2
            // 
            this.Column2.HeaderText = "Shipment";
            this.Column2.Name = "Column2";
            this.Column2.ReadOnly = true;
            this.Column2.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            this.Column2.Width = 150;
            // 
            // Column3
            // 
            this.Column3.HeaderText = "Sales Type";
            this.Column3.Name = "Column3";
            this.Column3.ReadOnly = true;
            this.Column3.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            this.Column3.Width = 150;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.ForeColor = System.Drawing.Color.Gold;
            this.label1.Location = new System.Drawing.Point(6, 13);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(63, 19);
            this.label1.TabIndex = 1;
            this.label1.Text = "Orders";
            // 
            // dgvSalesOrderItems
            // 
            this.dgvSalesOrderItems.AllowUserToAddRows = false;
            this.dgvSalesOrderItems.AllowUserToDeleteRows = false;
            this.dgvSalesOrderItems.AllowUserToResizeColumns = false;
            this.dgvSalesOrderItems.AllowUserToResizeRows = false;
            this.dgvSalesOrderItems.BackgroundColor = System.Drawing.Color.White;
            this.dgvSalesOrderItems.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.dgvSalesOrderItems.ColumnHeadersBorderStyle = System.Windows.Forms.DataGridViewHeaderBorderStyle.Single;
            dataGridViewCellStyle16.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle16.BackColor = System.Drawing.Color.DimGray;
            dataGridViewCellStyle16.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle16.ForeColor = System.Drawing.Color.White;
            dataGridViewCellStyle16.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle16.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle16.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.dgvSalesOrderItems.ColumnHeadersDefaultCellStyle = dataGridViewCellStyle16;
            this.dgvSalesOrderItems.ColumnHeadersHeight = 40;
            this.dgvSalesOrderItems.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.DisableResizing;
            this.dgvSalesOrderItems.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.Column8,
            this.dataGridViewTextBoxColumn1,
            this.dataGridViewTextBoxColumn2,
            this.dataGridViewTextBoxColumn3,
            this.dataGridViewTextBoxColumn4,
            this.dataGridViewTextBoxColumn5,
            this.Column6,
            this.Column7,
            this.Column9,
            this.Column10,
            this.Column11});
            this.dgvSalesOrderItems.Dock = System.Windows.Forms.DockStyle.Fill;
            this.dgvSalesOrderItems.EnableHeadersVisualStyles = false;
            this.dgvSalesOrderItems.Location = new System.Drawing.Point(10, 10);
            this.dgvSalesOrderItems.MultiSelect = false;
            this.dgvSalesOrderItems.Name = "dgvSalesOrderItems";
            this.dgvSalesOrderItems.ReadOnly = true;
            this.dgvSalesOrderItems.RowHeadersBorderStyle = System.Windows.Forms.DataGridViewHeaderBorderStyle.None;
            dataGridViewCellStyle18.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle18.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle18.ForeColor = System.Drawing.SystemColors.WindowText;
            dataGridViewCellStyle18.SelectionBackColor = System.Drawing.SystemColors.Highlight;
            dataGridViewCellStyle18.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle18.WrapMode = System.Windows.Forms.DataGridViewTriState.True;
            this.dgvSalesOrderItems.RowHeadersDefaultCellStyle = dataGridViewCellStyle18;
            this.dgvSalesOrderItems.RowHeadersVisible = false;
            this.dgvSalesOrderItems.RowTemplate.DefaultCellStyle.Font = new System.Drawing.Font("Tahoma", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.dgvSalesOrderItems.RowTemplate.Height = 30;
            this.dgvSalesOrderItems.RowTemplate.Resizable = System.Windows.Forms.DataGridViewTriState.False;
            this.dgvSalesOrderItems.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.dgvSalesOrderItems.Size = new System.Drawing.Size(1330, 213);
            this.dgvSalesOrderItems.TabIndex = 3;
            this.dgvSalesOrderItems.CellClick += new System.Windows.Forms.DataGridViewCellEventHandler(this.dgvSalesOrderItems_CellClick);
            this.dgvSalesOrderItems.CellContentDoubleClick += new System.Windows.Forms.DataGridViewCellEventHandler(this.dgvSalesOrderItems_CellContentDoubleClick);
            // 
            // Column8
            // 
            this.Column8.HeaderText = "Item";
            this.Column8.Name = "Column8";
            this.Column8.ReadOnly = true;
            this.Column8.Width = 40;
            // 
            // dataGridViewTextBoxColumn1
            // 
            dataGridViewCellStyle17.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.dataGridViewTextBoxColumn1.DefaultCellStyle = dataGridViewCellStyle17;
            this.dataGridViewTextBoxColumn1.HeaderText = "Brand";
            this.dataGridViewTextBoxColumn1.Name = "dataGridViewTextBoxColumn1";
            this.dataGridViewTextBoxColumn1.ReadOnly = true;
            this.dataGridViewTextBoxColumn1.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            this.dataGridViewTextBoxColumn1.Width = 150;
            // 
            // dataGridViewTextBoxColumn2
            // 
            this.dataGridViewTextBoxColumn2.AutoSizeMode = System.Windows.Forms.DataGridViewAutoSizeColumnMode.Fill;
            this.dataGridViewTextBoxColumn2.HeaderText = "Name";
            this.dataGridViewTextBoxColumn2.Name = "dataGridViewTextBoxColumn2";
            this.dataGridViewTextBoxColumn2.ReadOnly = true;
            this.dataGridViewTextBoxColumn2.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            // 
            // dataGridViewTextBoxColumn3
            // 
            this.dataGridViewTextBoxColumn3.HeaderText = "Description";
            this.dataGridViewTextBoxColumn3.Name = "dataGridViewTextBoxColumn3";
            this.dataGridViewTextBoxColumn3.ReadOnly = true;
            this.dataGridViewTextBoxColumn3.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            this.dataGridViewTextBoxColumn3.Width = 250;
            // 
            // dataGridViewTextBoxColumn4
            // 
            this.dataGridViewTextBoxColumn4.HeaderText = "Qty";
            this.dataGridViewTextBoxColumn4.Name = "dataGridViewTextBoxColumn4";
            this.dataGridViewTextBoxColumn4.ReadOnly = true;
            this.dataGridViewTextBoxColumn4.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            // 
            // dataGridViewTextBoxColumn5
            // 
            this.dataGridViewTextBoxColumn5.HeaderText = "Unit";
            this.dataGridViewTextBoxColumn5.Name = "dataGridViewTextBoxColumn5";
            this.dataGridViewTextBoxColumn5.ReadOnly = true;
            this.dataGridViewTextBoxColumn5.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            // 
            // Column6
            // 
            this.Column6.HeaderText = "Price";
            this.Column6.Name = "Column6";
            this.Column6.ReadOnly = true;
            this.Column6.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            // 
            // Column7
            // 
            this.Column7.HeaderText = "Total Amount";
            this.Column7.Name = "Column7";
            this.Column7.ReadOnly = true;
            this.Column7.SortMode = System.Windows.Forms.DataGridViewColumnSortMode.NotSortable;
            // 
            // Column9
            // 
            this.Column9.HeaderText = "product_id";
            this.Column9.Name = "Column9";
            this.Column9.ReadOnly = true;
            this.Column9.Visible = false;
            // 
            // Column10
            // 
            this.Column10.HeaderText = "order_no";
            this.Column10.Name = "Column10";
            this.Column10.ReadOnly = true;
            this.Column10.Visible = false;
            // 
            // Column11
            // 
            this.Column11.HeaderText = "id";
            this.Column11.Name = "Column11";
            this.Column11.ReadOnly = true;
            this.Column11.Visible = false;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label2.ForeColor = System.Drawing.Color.Gold;
            this.label2.Location = new System.Drawing.Point(6, 17);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(56, 19);
            this.label2.TabIndex = 2;
            this.label2.Text = "Items";
            // 
            // btnPrintReceipt
            // 
            this.btnPrintReceipt.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnPrintReceipt.ForeColor = System.Drawing.SystemColors.HotTrack;
            this.btnPrintReceipt.Image = ((System.Drawing.Image)(resources.GetObject("btnPrintReceipt.Image")));
            this.btnPrintReceipt.Location = new System.Drawing.Point(328, 4);
            this.btnPrintReceipt.Name = "btnPrintReceipt";
            this.btnPrintReceipt.Size = new System.Drawing.Size(100, 70);
            this.btnPrintReceipt.TabIndex = 0;
            this.btnPrintReceipt.Text = "Print Receipt";
            this.btnPrintReceipt.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.btnPrintReceipt.UseVisualStyleBackColor = true;
            this.btnPrintReceipt.Visible = false;
            // 
            // btnPrint
            // 
            this.btnPrint.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnPrint.ForeColor = System.Drawing.SystemColors.HotTrack;
            this.btnPrint.Image = ((System.Drawing.Image)(resources.GetObject("btnPrint.Image")));
            this.btnPrint.Location = new System.Drawing.Point(116, 4);
            this.btnPrint.Name = "btnPrint";
            this.btnPrint.Size = new System.Drawing.Size(100, 70);
            this.btnPrint.TabIndex = 1;
            this.btnPrint.Text = "Print";
            this.btnPrint.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.btnPrint.UseVisualStyleBackColor = true;
            this.btnPrint.Visible = false;
            // 
            // btnChangeQty
            // 
            this.btnChangeQty.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnChangeQty.ForeColor = System.Drawing.SystemColors.HotTrack;
            this.btnChangeQty.Image = ((System.Drawing.Image)(resources.GetObject("btnChangeQty.Image")));
            this.btnChangeQty.Location = new System.Drawing.Point(339, 3);
            this.btnChangeQty.Name = "btnChangeQty";
            this.btnChangeQty.Size = new System.Drawing.Size(100, 70);
            this.btnChangeQty.TabIndex = 2;
            this.btnChangeQty.Text = "Change Qty";
            this.btnChangeQty.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.btnChangeQty.UseVisualStyleBackColor = true;
            this.btnChangeQty.Click += new System.EventHandler(this.btnChangeQty_Click);
            // 
            // btnPayment
            // 
            this.btnPayment.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnPayment.ForeColor = System.Drawing.SystemColors.HotTrack;
            this.btnPayment.Image = ((System.Drawing.Image)(resources.GetObject("btnPayment.Image")));
            this.btnPayment.Location = new System.Drawing.Point(39, 3);
            this.btnPayment.Name = "btnPayment";
            this.btnPayment.Size = new System.Drawing.Size(100, 70);
            this.btnPayment.TabIndex = 3;
            this.btnPayment.Text = "Payment";
            this.btnPayment.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.btnPayment.UseVisualStyleBackColor = true;
            this.btnPayment.Click += new System.EventHandler(this.btnPayment_Click);
            // 
            // btnBigPrint
            // 
            this.btnBigPrint.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnBigPrint.ForeColor = System.Drawing.SystemColors.HotTrack;
            this.btnBigPrint.Image = ((System.Drawing.Image)(resources.GetObject("btnBigPrint.Image")));
            this.btnBigPrint.Location = new System.Drawing.Point(222, 4);
            this.btnBigPrint.Name = "btnBigPrint";
            this.btnBigPrint.Size = new System.Drawing.Size(100, 70);
            this.btnBigPrint.TabIndex = 4;
            this.btnBigPrint.Text = "Big Print";
            this.btnBigPrint.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.btnBigPrint.UseVisualStyleBackColor = true;
            this.btnBigPrint.Visible = false;
            // 
            // btnRemoveItem
            // 
            this.btnRemoveItem.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnRemoveItem.ForeColor = System.Drawing.SystemColors.HotTrack;
            this.btnRemoveItem.Image = ((System.Drawing.Image)(resources.GetObject("btnRemoveItem.Image")));
            this.btnRemoveItem.Location = new System.Drawing.Point(439, 3);
            this.btnRemoveItem.Name = "btnRemoveItem";
            this.btnRemoveItem.Size = new System.Drawing.Size(100, 70);
            this.btnRemoveItem.TabIndex = 5;
            this.btnRemoveItem.Text = "Remove Item";
            this.btnRemoveItem.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.btnRemoveItem.UseVisualStyleBackColor = true;
            this.btnRemoveItem.Click += new System.EventHandler(this.btnRemoveItem_Click);
            // 
            // btnChangePrice
            // 
            this.btnChangePrice.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnChangePrice.ForeColor = System.Drawing.SystemColors.HotTrack;
            this.btnChangePrice.Image = ((System.Drawing.Image)(resources.GetObject("btnChangePrice.Image")));
            this.btnChangePrice.Location = new System.Drawing.Point(539, 3);
            this.btnChangePrice.Name = "btnChangePrice";
            this.btnChangePrice.Size = new System.Drawing.Size(100, 70);
            this.btnChangePrice.TabIndex = 6;
            this.btnChangePrice.Text = "Change Price";
            this.btnChangePrice.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.btnChangePrice.UseVisualStyleBackColor = true;
            this.btnChangePrice.Click += new System.EventHandler(this.btnChangePrice_Click);
            // 
            // BtnDiscount
            // 
            this.BtnDiscount.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.BtnDiscount.ForeColor = System.Drawing.SystemColors.HotTrack;
            this.BtnDiscount.Image = ((System.Drawing.Image)(resources.GetObject("BtnDiscount.Image")));
            this.BtnDiscount.Location = new System.Drawing.Point(639, 3);
            this.BtnDiscount.Name = "BtnDiscount";
            this.BtnDiscount.Size = new System.Drawing.Size(100, 70);
            this.BtnDiscount.TabIndex = 7;
            this.BtnDiscount.Text = "Discount";
            this.BtnDiscount.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.BtnDiscount.UseVisualStyleBackColor = true;
            this.BtnDiscount.Click += new System.EventHandler(this.BtnDiscount_Click);
            // 
            // btnCancelOrder
            // 
            this.btnCancelOrder.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnCancelOrder.ForeColor = System.Drawing.SystemColors.HotTrack;
            this.btnCancelOrder.Image = ((System.Drawing.Image)(resources.GetObject("btnCancelOrder.Image")));
            this.btnCancelOrder.Location = new System.Drawing.Point(739, 3);
            this.btnCancelOrder.Name = "btnCancelOrder";
            this.btnCancelOrder.Size = new System.Drawing.Size(100, 70);
            this.btnCancelOrder.TabIndex = 8;
            this.btnCancelOrder.Text = "Cancel Order";
            this.btnCancelOrder.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.btnCancelOrder.UseVisualStyleBackColor = true;
            this.btnCancelOrder.Click += new System.EventHandler(this.btnCancelOrder_Click);
            // 
            // panelOrderToolbar
            // 
            this.panelOrderToolbar.Controls.Add(this.btnPayment);
            this.panelOrderToolbar.Controls.Add(this.btnShipment);
            this.panelOrderToolbar.Controls.Add(this.btnSalesType);
            this.panelOrderToolbar.Controls.Add(this.btnCancelOrder);
            this.panelOrderToolbar.Controls.Add(this.btnRemoveItem);
            this.panelOrderToolbar.Controls.Add(this.btnChangePrice);
            this.panelOrderToolbar.Controls.Add(this.btnChangeQty);
            this.panelOrderToolbar.Controls.Add(this.BtnDiscount);
            this.panelOrderToolbar.Dock = System.Windows.Forms.DockStyle.Right;
            this.panelOrderToolbar.Location = new System.Drawing.Point(496, 0);
            this.panelOrderToolbar.Name = "panelOrderToolbar";
            this.panelOrderToolbar.Size = new System.Drawing.Size(854, 79);
            this.panelOrderToolbar.TabIndex = 9;
            // 
            // btnShipment
            // 
            this.btnShipment.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnShipment.ForeColor = System.Drawing.SystemColors.HotTrack;
            this.btnShipment.Image = ((System.Drawing.Image)(resources.GetObject("btnShipment.Image")));
            this.btnShipment.Location = new System.Drawing.Point(239, 3);
            this.btnShipment.Name = "btnShipment";
            this.btnShipment.Size = new System.Drawing.Size(100, 70);
            this.btnShipment.TabIndex = 10;
            this.btnShipment.Text = "Shipment";
            this.btnShipment.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.btnShipment.UseVisualStyleBackColor = true;
            this.btnShipment.Click += new System.EventHandler(this.btnShipment_Click);
            // 
            // btnSalesType
            // 
            this.btnSalesType.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnSalesType.ForeColor = System.Drawing.SystemColors.HotTrack;
            this.btnSalesType.Image = ((System.Drawing.Image)(resources.GetObject("btnSalesType.Image")));
            this.btnSalesType.Location = new System.Drawing.Point(139, 3);
            this.btnSalesType.Name = "btnSalesType";
            this.btnSalesType.Size = new System.Drawing.Size(100, 70);
            this.btnSalesType.TabIndex = 9;
            this.btnSalesType.Text = "Sales Type";
            this.btnSalesType.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.btnSalesType.UseVisualStyleBackColor = true;
            this.btnSalesType.Click += new System.EventHandler(this.btnSalesType_Click);
            // 
            // btnClosing
            // 
            this.btnClosing.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnClosing.ForeColor = System.Drawing.SystemColors.HotTrack;
            this.btnClosing.Location = new System.Drawing.Point(10, 4);
            this.btnClosing.Name = "btnClosing";
            this.btnClosing.Size = new System.Drawing.Size(100, 70);
            this.btnClosing.TabIndex = 11;
            this.btnClosing.Text = "Day Closing";
            this.btnClosing.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.btnClosing.UseVisualStyleBackColor = true;
            this.btnClosing.Click += new System.EventHandler(this.btnClosing_Click);
            // 
            // lblTotalAmountDue
            // 
            this.lblTotalAmountDue.BackColor = System.Drawing.Color.Gainsboro;
            this.lblTotalAmountDue.Font = new System.Drawing.Font("Tahoma", 18F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblTotalAmountDue.Location = new System.Drawing.Point(360, 8);
            this.lblTotalAmountDue.Name = "lblTotalAmountDue";
            this.lblTotalAmountDue.Padding = new System.Windows.Forms.Padding(5);
            this.lblTotalAmountDue.Size = new System.Drawing.Size(214, 44);
            this.lblTotalAmountDue.TabIndex = 5;
            this.lblTotalAmountDue.Text = "0.00";
            this.lblTotalAmountDue.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Font = new System.Drawing.Font("Tahoma", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label7.Location = new System.Drawing.Point(101, 18);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(175, 23);
            this.label7.TabIndex = 4;
            this.label7.Text = "Total Amount Due :";
            // 
            // lblTotalDiscount
            // 
            this.lblTotalDiscount.AutoSize = true;
            this.lblTotalDiscount.Font = new System.Drawing.Font("Tahoma", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblTotalDiscount.Location = new System.Drawing.Point(360, 18);
            this.lblTotalDiscount.Name = "lblTotalDiscount";
            this.lblTotalDiscount.Size = new System.Drawing.Size(20, 23);
            this.lblTotalDiscount.TabIndex = 3;
            this.lblTotalDiscount.Text = "0";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Font = new System.Drawing.Font("Tahoma", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label5.Location = new System.Drawing.Point(212, 18);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(142, 23);
            this.label5.TabIndex = 2;
            this.label5.Text = "Total Discount :";
            // 
            // lblTotalItems
            // 
            this.lblTotalItems.AutoSize = true;
            this.lblTotalItems.Font = new System.Drawing.Font("Tahoma", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblTotalItems.Location = new System.Drawing.Point(135, 18);
            this.lblTotalItems.Name = "lblTotalItems";
            this.lblTotalItems.Size = new System.Drawing.Size(20, 23);
            this.lblTotalItems.TabIndex = 1;
            this.lblTotalItems.Text = "0";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Tahoma", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label3.Location = new System.Drawing.Point(12, 18);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(117, 23);
            this.label3.TabIndex = 0;
            this.label3.Text = "Total Items :";
            // 
            // panel10
            // 
            this.panel10.Controls.Add(this.btnClosing);
            this.panel10.Controls.Add(this.btnRefreshData);
            this.panel10.Controls.Add(this.btnPrintReceipt);
            this.panel10.Controls.Add(this.btnPrint);
            this.panel10.Controls.Add(this.btnBigPrint);
            this.panel10.Controls.Add(this.panelOrderToolbar);
            this.panel10.Dock = System.Windows.Forms.DockStyle.Bottom;
            this.panel10.Location = new System.Drawing.Point(0, 582);
            this.panel10.Name = "panel10";
            this.panel10.Size = new System.Drawing.Size(1350, 79);
            this.panel10.TabIndex = 7;
            // 
            // btnRefreshData
            // 
            this.btnRefreshData.Location = new System.Drawing.Point(434, 5);
            this.btnRefreshData.Name = "btnRefreshData";
            this.btnRefreshData.Size = new System.Drawing.Size(52, 64);
            this.btnRefreshData.TabIndex = 10;
            this.btnRefreshData.Text = "Refresh Data";
            this.btnRefreshData.UseVisualStyleBackColor = true;
            this.btnRefreshData.Visible = false;
            this.btnRefreshData.Click += new System.EventHandler(this.btnRefreshData_Click);
            // 
            // tmrData
            // 
            this.tmrData.Interval = 15000;
            this.tmrData.Tick += new System.EventHandler(this.tmrData_Tick);
            // 
            // panel8
            // 
            this.panel8.BackColor = System.Drawing.Color.White;
            this.panel8.Controls.Add(this.lblDeliveryFee);
            this.panel8.Controls.Add(this.label8);
            this.panel8.Controls.Add(this.panel11);
            this.panel8.Controls.Add(this.lblTotalDiscount);
            this.panel8.Controls.Add(this.label3);
            this.panel8.Controls.Add(this.label5);
            this.panel8.Controls.Add(this.lblTotalItems);
            this.panel8.Dock = System.Windows.Forms.DockStyle.Bottom;
            this.panel8.Location = new System.Drawing.Point(0, 523);
            this.panel8.Name = "panel8";
            this.panel8.Size = new System.Drawing.Size(1350, 59);
            this.panel8.TabIndex = 8;
            // 
            // lblDeliveryFee
            // 
            this.lblDeliveryFee.AutoSize = true;
            this.lblDeliveryFee.Font = new System.Drawing.Font("Tahoma", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblDeliveryFee.Location = new System.Drawing.Point(609, 18);
            this.lblDeliveryFee.Name = "lblDeliveryFee";
            this.lblDeliveryFee.Size = new System.Drawing.Size(20, 23);
            this.lblDeliveryFee.TabIndex = 11;
            this.lblDeliveryFee.Text = "0";
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Font = new System.Drawing.Font("Tahoma", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label8.Location = new System.Drawing.Point(479, 18);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(125, 23);
            this.label8.TabIndex = 10;
            this.label8.Text = "Delivery Fee :";
            // 
            // panel11
            // 
            this.panel11.Controls.Add(this.label4);
            this.panel11.Controls.Add(this.lblTotalAmountDue);
            this.panel11.Controls.Add(this.label7);
            this.panel11.Dock = System.Windows.Forms.DockStyle.Right;
            this.panel11.Location = new System.Drawing.Point(761, 0);
            this.panel11.Name = "panel11";
            this.panel11.Size = new System.Drawing.Size(589, 59);
            this.panel11.TabIndex = 9;
            // 
            // label4
            // 
            this.label4.BackColor = System.Drawing.Color.Gainsboro;
            this.label4.Font = new System.Drawing.Font("Tahoma", 18F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label4.Location = new System.Drawing.Point(282, 8);
            this.label4.Name = "label4";
            this.label4.Padding = new System.Windows.Forms.Padding(5);
            this.label4.Size = new System.Drawing.Size(73, 44);
            this.label4.TabIndex = 6;
            this.label4.Text = "PHP";
            this.label4.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // panel1
            // 
            this.panel1.Controls.Add(this.panel4);
            this.panel1.Controls.Add(this.panel3);
            this.panel1.Dock = System.Windows.Forms.DockStyle.Top;
            this.panel1.Location = new System.Drawing.Point(0, 0);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(1350, 252);
            this.panel1.TabIndex = 9;
            // 
            // panel4
            // 
            this.panel4.Controls.Add(this.dgvSalesOrders);
            this.panel4.Dock = System.Windows.Forms.DockStyle.Fill;
            this.panel4.Location = new System.Drawing.Point(0, 43);
            this.panel4.Name = "panel4";
            this.panel4.Padding = new System.Windows.Forms.Padding(10, 0, 10, 10);
            this.panel4.Size = new System.Drawing.Size(1350, 209);
            this.panel4.TabIndex = 3;
            // 
            // panel3
            // 
            this.panel3.Controls.Add(this.panel9);
            this.panel3.Controls.Add(this.panel7);
            this.panel3.Controls.Add(this.label1);
            this.panel3.Dock = System.Windows.Forms.DockStyle.Top;
            this.panel3.Location = new System.Drawing.Point(0, 0);
            this.panel3.Name = "panel3";
            this.panel3.Size = new System.Drawing.Size(1350, 43);
            this.panel3.TabIndex = 2;
            // 
            // panel7
            // 
            this.panel7.Controls.Add(this.btnChangeDate);
            this.panel7.Controls.Add(this.dtOrderDate);
            this.panel7.Dock = System.Windows.Forms.DockStyle.Right;
            this.panel7.Location = new System.Drawing.Point(835, 0);
            this.panel7.Name = "panel7";
            this.panel7.Size = new System.Drawing.Size(515, 43);
            this.panel7.TabIndex = 3;
            // 
            // btnChangeDate
            // 
            this.btnChangeDate.BackColor = System.Drawing.Color.Gold;
            this.btnChangeDate.FlatAppearance.BorderColor = System.Drawing.Color.DimGray;
            this.btnChangeDate.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnChangeDate.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnChangeDate.Location = new System.Drawing.Point(48, 7);
            this.btnChangeDate.Name = "btnChangeDate";
            this.btnChangeDate.Size = new System.Drawing.Size(108, 30);
            this.btnChangeDate.TabIndex = 3;
            this.btnChangeDate.Text = "Change Date";
            this.btnChangeDate.UseVisualStyleBackColor = false;
            this.btnChangeDate.Click += new System.EventHandler(this.btnChangeDate_Click);
            // 
            // dtOrderDate
            // 
            this.dtOrderDate.Font = new System.Drawing.Font("Tahoma", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.dtOrderDate.Location = new System.Drawing.Point(155, 7);
            this.dtOrderDate.Name = "dtOrderDate";
            this.dtOrderDate.Size = new System.Drawing.Size(349, 30);
            this.dtOrderDate.TabIndex = 2;
            this.dtOrderDate.ValueChanged += new System.EventHandler(this.dtOrderDate_ValueChanged);
            // 
            // panel2
            // 
            this.panel2.Controls.Add(this.panel6);
            this.panel2.Controls.Add(this.panel5);
            this.panel2.Dock = System.Windows.Forms.DockStyle.Fill;
            this.panel2.Location = new System.Drawing.Point(0, 252);
            this.panel2.Name = "panel2";
            this.panel2.Size = new System.Drawing.Size(1350, 271);
            this.panel2.TabIndex = 10;
            // 
            // panel6
            // 
            this.panel6.Controls.Add(this.dgvSalesOrderItems);
            this.panel6.Dock = System.Windows.Forms.DockStyle.Fill;
            this.panel6.Location = new System.Drawing.Point(0, 38);
            this.panel6.Name = "panel6";
            this.panel6.Padding = new System.Windows.Forms.Padding(10);
            this.panel6.Size = new System.Drawing.Size(1350, 233);
            this.panel6.TabIndex = 5;
            // 
            // panel5
            // 
            this.panel5.Controls.Add(this.label2);
            this.panel5.Dock = System.Windows.Forms.DockStyle.Top;
            this.panel5.Location = new System.Drawing.Point(0, 0);
            this.panel5.Name = "panel5";
            this.panel5.Size = new System.Drawing.Size(1350, 38);
            this.panel5.TabIndex = 4;
            // 
            // btnManualRefresh
            // 
            this.btnManualRefresh.BackColor = System.Drawing.Color.SpringGreen;
            this.btnManualRefresh.FlatAppearance.BorderColor = System.Drawing.Color.DimGray;
            this.btnManualRefresh.FlatAppearance.BorderSize = 0;
            this.btnManualRefresh.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnManualRefresh.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnManualRefresh.Location = new System.Drawing.Point(522, 7);
            this.btnManualRefresh.Name = "btnManualRefresh";
            this.btnManualRefresh.Size = new System.Drawing.Size(219, 30);
            this.btnManualRefresh.TabIndex = 4;
            this.btnManualRefresh.Text = "MANUAL REFRESH DATA";
            this.btnManualRefresh.UseVisualStyleBackColor = false;
            this.btnManualRefresh.Click += new System.EventHandler(this.btnManualRefresh_Click);
            // 
            // btnStopRefresh
            // 
            this.btnStopRefresh.BackColor = System.Drawing.Color.OrangeRed;
            this.btnStopRefresh.FlatAppearance.BorderColor = System.Drawing.Color.DimGray;
            this.btnStopRefresh.FlatAppearance.BorderSize = 0;
            this.btnStopRefresh.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnStopRefresh.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnStopRefresh.Location = new System.Drawing.Point(379, 7);
            this.btnStopRefresh.Name = "btnStopRefresh";
            this.btnStopRefresh.Size = new System.Drawing.Size(137, 30);
            this.btnStopRefresh.TabIndex = 5;
            this.btnStopRefresh.Text = "STOP REFRESH";
            this.btnStopRefresh.UseVisualStyleBackColor = false;
            this.btnStopRefresh.Click += new System.EventHandler(this.btnStopRefresh_Click);
            // 
            // panel9
            // 
            this.panel9.Controls.Add(this.lblDataRefreshNote);
            this.panel9.Controls.Add(this.btnManualRefresh);
            this.panel9.Controls.Add(this.btnStopRefresh);
            this.panel9.Dock = System.Windows.Forms.DockStyle.Right;
            this.panel9.Location = new System.Drawing.Point(88, 0);
            this.panel9.Name = "panel9";
            this.panel9.Size = new System.Drawing.Size(747, 43);
            this.panel9.TabIndex = 6;
            // 
            // lblDataRefreshNote
            // 
            this.lblDataRefreshNote.AutoSize = true;
            this.lblDataRefreshNote.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblDataRefreshNote.ForeColor = System.Drawing.Color.OrangeRed;
            this.lblDataRefreshNote.Location = new System.Drawing.Point(124, 13);
            this.lblDataRefreshNote.Name = "lblDataRefreshNote";
            this.lblDataRefreshNote.Size = new System.Drawing.Size(247, 19);
            this.lblDataRefreshNote.TabIndex = 7;
            this.lblDataRefreshNote.Text = "Data Refreshing is DISABLED";
            this.lblDataRefreshNote.Visible = false;
            // 
            // frmOrders
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1350, 661);
            this.Controls.Add(this.panel2);
            this.Controls.Add(this.panel1);
            this.Controls.Add(this.panel8);
            this.Controls.Add(this.panel10);
            this.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Name = "frmOrders";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Text = "frmOrders";
            this.WindowState = System.Windows.Forms.FormWindowState.Maximized;
            this.Load += new System.EventHandler(this.frmOrders_Load);
            ((System.ComponentModel.ISupportInitialize)(this.dgvSalesOrders)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.dgvSalesOrderItems)).EndInit();
            this.panelOrderToolbar.ResumeLayout(false);
            this.panel10.ResumeLayout(false);
            this.panel8.ResumeLayout(false);
            this.panel8.PerformLayout();
            this.panel11.ResumeLayout(false);
            this.panel11.PerformLayout();
            this.panel1.ResumeLayout(false);
            this.panel4.ResumeLayout(false);
            this.panel3.ResumeLayout(false);
            this.panel3.PerformLayout();
            this.panel7.ResumeLayout(false);
            this.panel2.ResumeLayout(false);
            this.panel6.ResumeLayout(false);
            this.panel5.ResumeLayout(false);
            this.panel5.PerformLayout();
            this.panel9.ResumeLayout(false);
            this.panel9.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.DataGridView dgvSalesOrders;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.DataGridView dgvSalesOrderItems;
        private System.Windows.Forms.Button btnPrintReceipt;
        private System.Windows.Forms.Button btnPrint;
        private System.Windows.Forms.Button btnCancelOrder;
        private System.Windows.Forms.Button BtnDiscount;
        private System.Windows.Forms.Button btnChangePrice;
        private System.Windows.Forms.Button btnRemoveItem;
        private System.Windows.Forms.Button btnBigPrint;
        private System.Windows.Forms.Button btnPayment;
        private System.Windows.Forms.Button btnChangeQty;
        private System.Windows.Forms.Panel panelOrderToolbar;
        private System.Windows.Forms.Panel panel10;
        private System.Windows.Forms.Label lblTotalAmountDue;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.Label lblTotalDiscount;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Label lblTotalItems;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Timer tmrData;
        private System.Windows.Forms.Button btnRefreshData;
        private System.Windows.Forms.Panel panel8;
        private System.Windows.Forms.Panel panel11;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.Panel panel4;
        private System.Windows.Forms.Panel panel3;
        private System.Windows.Forms.Panel panel2;
        private System.Windows.Forms.Panel panel6;
        private System.Windows.Forms.Panel panel5;
        private System.Windows.Forms.Button btnClosing;
        private System.Windows.Forms.Button btnShipment;
        private System.Windows.Forms.Button btnSalesType;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column1;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column4;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column5;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column2;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column3;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column8;
        private System.Windows.Forms.DataGridViewTextBoxColumn dataGridViewTextBoxColumn1;
        private System.Windows.Forms.DataGridViewTextBoxColumn dataGridViewTextBoxColumn2;
        private System.Windows.Forms.DataGridViewTextBoxColumn dataGridViewTextBoxColumn3;
        private System.Windows.Forms.DataGridViewTextBoxColumn dataGridViewTextBoxColumn4;
        private System.Windows.Forms.DataGridViewTextBoxColumn dataGridViewTextBoxColumn5;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column6;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column7;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column9;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column10;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column11;
        private System.Windows.Forms.Label lblDeliveryFee;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.Panel panel7;
        private System.Windows.Forms.DateTimePicker dtOrderDate;
        private System.Windows.Forms.Button btnChangeDate;
        private System.Windows.Forms.Button btnManualRefresh;
        private System.Windows.Forms.Button btnStopRefresh;
        private System.Windows.Forms.Panel panel9;
        private System.Windows.Forms.Label lblDataRefreshNote;
    }
}