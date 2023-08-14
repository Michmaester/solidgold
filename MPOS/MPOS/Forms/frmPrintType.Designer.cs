
namespace MPOS.Forms
{
    partial class frmPrintType
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
            this.btnDefaultPrintType = new System.Windows.Forms.Button();
            this.btnBigPrint = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // btnDefaultPrintType
            // 
            this.btnDefaultPrintType.BackColor = System.Drawing.Color.MediumSpringGreen;
            this.btnDefaultPrintType.Font = new System.Drawing.Font("Tahoma", 20.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnDefaultPrintType.Location = new System.Drawing.Point(12, 12);
            this.btnDefaultPrintType.Name = "btnDefaultPrintType";
            this.btnDefaultPrintType.Size = new System.Drawing.Size(162, 157);
            this.btnDefaultPrintType.TabIndex = 0;
            this.btnDefaultPrintType.Text = "Default 1/4";
            this.btnDefaultPrintType.UseVisualStyleBackColor = false;
            this.btnDefaultPrintType.Click += new System.EventHandler(this.btnDefaultPrintType_Click);
            // 
            // btnBigPrint
            // 
            this.btnBigPrint.BackColor = System.Drawing.Color.LimeGreen;
            this.btnBigPrint.Font = new System.Drawing.Font("Tahoma", 20.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnBigPrint.Location = new System.Drawing.Point(184, 12);
            this.btnBigPrint.Name = "btnBigPrint";
            this.btnBigPrint.Size = new System.Drawing.Size(162, 157);
            this.btnBigPrint.TabIndex = 1;
            this.btnBigPrint.Text = "BIG Print";
            this.btnBigPrint.UseVisualStyleBackColor = false;
            this.btnBigPrint.Click += new System.EventHandler(this.btnBigPrint_Click);
            // 
            // frmPrintType
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(361, 182);
            this.ControlBox = false;
            this.Controls.Add(this.btnBigPrint);
            this.Controls.Add(this.btnDefaultPrintType);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.Name = "frmPrintType";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Text = "Select Print Type";
            this.Load += new System.EventHandler(this.frmPrintType_Load);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Button btnDefaultPrintType;
        private System.Windows.Forms.Button btnBigPrint;
    }
}