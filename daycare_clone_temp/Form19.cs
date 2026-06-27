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
    public partial class Form19 : Form
    {
        public Form19()
        {
            InitializeComponent();
        }

        private void button6_Click(object sender, EventArgs e)
        {
            Form1 form1 = new Form1();


            form1.Show();


            this.Hide();
        }

        private void button5_Click(object sender, EventArgs e)
        {
            // Create an instance of Form5
            Form20 form20 = new Form20();

            // Show Form6
            form20.Show();

            // Optionally, you can hide Form1
            this.Hide();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            // Create an instance of Form5
            Form18 form18 = new Form18();

            // Show Form6
            form18.Show();

            // Optionally, you can hide Form1
            this.Hide();
        }

        private void button7_Click(object sender, EventArgs e)
        {
            // Create an instance of Form5
            Form21 form21 = new Form21();

            // Show Form6
            form21.Show();

            // Optionally, you can hide Form1
            this.Hide();
        }

        private void button8_Click(object sender, EventArgs e)
        {
            // Create an instance of Form5
            Form22 form22 = new Form22();

            // Show Form6
            form22.Show();

            // Optionally, you can hide Form1
            this.Hide();
        }

        private void button9_Click(object sender, EventArgs e)
        {
            // Create an instance of Form5
            Form23 form23 = new Form23();

            // Show Form6
            form23.Show();

            // Optionally, you can hide Form1
            this.Hide();
        }
    }
}
