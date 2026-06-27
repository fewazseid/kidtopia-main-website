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
    public partial class Form9 : Form
    {
        public Form9()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            Form1 form1 = new Form1();

            // Show Form6
            form1.Show();

            // Optionally, you can hide Form1
            this.Hide();
        }

        private void button2_Click(object sender, EventArgs e)
        {

            Form8 form8 = new Form8();

            // Show Form6
            form8.Show();

            // Optionally, you can hide Form1
            this.Hide();
        }

        private void button4_Click(object sender, EventArgs e)
        {
            Form10 form10 = new Form10();

            // Show Form6
            form10.Show();

            // Optionally, you can hide Form1
            this.Hide();

        }

        private void button3_Click(object sender, EventArgs e)
        {
            Form11 form11 = new Form11();

            // Show Form6
            form11.Show();

            // Optionally, you can hide Form1
            this.Hide();
        }
    }
}
