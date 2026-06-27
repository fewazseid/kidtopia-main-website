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
    public partial class Form18 : Form
    {
        public Form18()
        {
            InitializeComponent();
        }

        private void button6_Click(object sender, EventArgs e)
        {
            Form1 form1 = new Form1();


            form1.Show();


            this.Hide();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            // Create an instance of Form5
            Form19 form19 = new Form19();

            // Show Form6
            form19.Show();

            // Optionally, you can hide Form1
            this.Hide();
        }

        private void button3_Click(object sender, EventArgs e)
        {
            // Create an instance of Form5
            Form24 form24 = new Form24();

            // Show Form6
            form24.Show();

            // Optionally, you can hide Form1
            this.Hide();
        }
    }
}
