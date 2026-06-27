using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace DBPROJ4
{
    public partial class Form14 : Form
    {
        public Form14()
        {
            InitializeComponent();
        }

        private void button6_Click(object sender, EventArgs e)
        {
            Form1 form1 = new Form1();

            // Show Form6
            form1.Show();

            // Optionally, you can hide Form1
            this.Hide();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            // Create an instance of Form5
            Form15 form15 = new Form15();

            // Show Form6
            form15.Show();

            // Optionally, you can hide Form1
            this.Hide();
        }
    }
}
