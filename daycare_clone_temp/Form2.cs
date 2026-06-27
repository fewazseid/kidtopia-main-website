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
    public partial class Form2 : Form
    {
        public Form2()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            // Create an instance of Form5
            Form5 form5 = new Form5();

            // Show Form6
            form5.Show();

            // Optionally, you can hide Form1
            this.Hide();
        }

        private void button3_Click(object sender, EventArgs e)
        {
            // Create an instance of Form5
            Form1 form1 = new Form1();

            // Show Form6
            form1.Show();

            // Optionally, you can hide Form1
            this.Hide();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            // Create an instance of Form5
            Form9 form9 = new Form9();

            // Show Form6
            form9.Show();

            // Optionally, you can hide Form1
            this.Hide();
        }
    }
}
