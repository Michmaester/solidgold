
namespace MecsTimeKeeper.Forms
{
    partial class frmBlocklist
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
            this.dgvBlockList = new System.Windows.Forms.DataGridView();
            this.btnAddBlock = new System.Windows.Forms.Button();
            this.textBox1 = new System.Windows.Forms.TextBox();
            this.btnRemoveBlock = new System.Windows.Forms.Button();
            this.comboBox1 = new System.Windows.Forms.ComboBox();
            ((System.ComponentModel.ISupportInitialize)(this.dgvBlockList)).BeginInit();
            this.SuspendLayout();
            // 
            // dgvBlockList
            // 
            this.dgvBlockList.AllowUserToAddRows = false;
            this.dgvBlockList.AllowUserToDeleteRows = false;
            this.dgvBlockList.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dgvBlockList.Location = new System.Drawing.Point(35, 204);
            this.dgvBlockList.Name = "dgvBlockList";
            this.dgvBlockList.ReadOnly = true;
            this.dgvBlockList.Size = new System.Drawing.Size(666, 176);
            this.dgvBlockList.TabIndex = 0;
            // 
            // btnAddBlock
            // 
            this.btnAddBlock.Location = new System.Drawing.Point(344, 30);
            this.btnAddBlock.Name = "btnAddBlock";
            this.btnAddBlock.Size = new System.Drawing.Size(123, 46);
            this.btnAddBlock.TabIndex = 1;
            this.btnAddBlock.Text = "Block";
            this.btnAddBlock.UseVisualStyleBackColor = true;
            // 
            // textBox1
            // 
            this.textBox1.Location = new System.Drawing.Point(35, 44);
            this.textBox1.Name = "textBox1";
            this.textBox1.Size = new System.Drawing.Size(264, 20);
            this.textBox1.TabIndex = 2;
            // 
            // btnRemoveBlock
            // 
            this.btnRemoveBlock.Location = new System.Drawing.Point(473, 30);
            this.btnRemoveBlock.Name = "btnRemoveBlock";
            this.btnRemoveBlock.Size = new System.Drawing.Size(123, 46);
            this.btnRemoveBlock.TabIndex = 3;
            this.btnRemoveBlock.Text = "Remove";
            this.btnRemoveBlock.UseVisualStyleBackColor = true;
            // 
            // comboBox1
            // 
            this.comboBox1.FormattingEnabled = true;
            this.comboBox1.Location = new System.Drawing.Point(35, 80);
            this.comboBox1.Name = "comboBox1";
            this.comboBox1.Size = new System.Drawing.Size(264, 21);
            this.comboBox1.TabIndex = 4;
            // 
            // frmBlocklist
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(849, 471);
            this.Controls.Add(this.comboBox1);
            this.Controls.Add(this.btnRemoveBlock);
            this.Controls.Add(this.textBox1);
            this.Controls.Add(this.btnAddBlock);
            this.Controls.Add(this.dgvBlockList);
            this.Name = "frmBlocklist";
            this.Text = "frmBlocklist";
            ((System.ComponentModel.ISupportInitialize)(this.dgvBlockList)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.DataGridView dgvBlockList;
        private System.Windows.Forms.Button btnAddBlock;
        private System.Windows.Forms.TextBox textBox1;
        private System.Windows.Forms.Button btnRemoveBlock;
        private System.Windows.Forms.ComboBox comboBox1;
    }
}