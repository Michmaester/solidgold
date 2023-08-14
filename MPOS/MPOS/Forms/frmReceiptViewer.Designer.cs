
namespace MPOS.Forms
{
    partial class frmReceiptViewer
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(frmReceiptViewer));
            this.rvReport = new Microsoft.Reporting.WinForms.ReportViewer();
            this.SuspendLayout();
            // 
            // rvReport
            // 
            this.rvReport.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.rvReport.Dock = System.Windows.Forms.DockStyle.Fill;
            this.rvReport.Location = new System.Drawing.Point(0, 0);
            this.rvReport.Name = "rvReport";
            this.rvReport.Size = new System.Drawing.Size(839, 492);
            this.rvReport.TabIndex = 3;
            // 
            // frmReceiptViewer
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(839, 492);
            this.Controls.Add(this.rvReport);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Name = "frmReceiptViewer";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Text = "Receipt Viewer";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.frmReceiptViewer_FormClosing);
            this.Load += new System.EventHandler(this.frmReceiptViewer_Load);
            this.ResumeLayout(false);

        }

        #endregion
        private Microsoft.Reporting.WinForms.ReportViewer rvReport;
    }
}