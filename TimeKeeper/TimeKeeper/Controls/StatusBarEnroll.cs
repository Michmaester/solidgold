﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MecsTimeKeeper.Controls
{
    public partial class StatusBarEnroll : UserControl
    {
       
        public Color StatusBarForeColor
        {
            get { return lblMessage.ForeColor; }
            set { lblMessage.ForeColor = value; }
        }

        public Color StatusBarBackColor
        {
            get { return lblMessage.BackColor; }
            set { lblMessage.BackColor = value; }
        }


        bool messageType;

        public bool MessageType
        {
            get { return messageType; }
            set { messageType = value; }
        }
        public string Message
        {
            get { return lblMessage.Text; }
            set { lblMessage.Text = value; }
        }

        public StatusBarEnroll()
        {
            InitializeComponent();
        }
    }
}
