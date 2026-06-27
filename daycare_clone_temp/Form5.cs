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
    public partial class Form5 : Form
    {
        public Form5()
        {
            InitializeComponent();
        }

        private void button6_Click(object sender, EventArgs e)
        {
            // Create an instance of Form5
            Form1 form1 = new Form1();

            // Show Form6
            form1.Show();

            // Optionally, you can hide Form1
            this.Hide();
        }

        private void button5_Click(object sender, EventArgs e)
        {
            // Create an instance of Form5
            Form6 form6 = new Form6();

            // Show Form6
            form6.Show();

            // Optionally, you can hide Form1
            this.Hide();
        }

        private void button1_Click(object sender, EventArgs e)
        {// Create an instance of Form5
            Form16 form16 = new Form16();

            // Show Form6
            form16.Show();

            // Optionally, you can hide Form1
            this.Hide();

        }

        private void button3_Click(object sender, EventArgs e)
        {// Create an instance of Form5
            Form13 form13 = new Form13();

            // Show Form6
            form13.Show();

            // Optionally, you can hide Form1
            this.Hide();

        }

        private void button2_Click(object sender, EventArgs e)
        {
            Form12 form12 = new Form12();

            // Show Form6
            form12.Show();

            // Optionally, you can hide Form1
            this.Hide();

        }
    }
}
