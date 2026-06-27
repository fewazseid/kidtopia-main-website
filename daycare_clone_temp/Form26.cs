using Microsoft.Data.SqlClient;
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
    public partial class Form26 : Form
    {
        public Form26()
        {
            InitializeComponent();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            // Create an instance of Form5
            Form24 form24 = new Form24();

            // Show Form6
            form24.Show();

            // Optionally, you can hide Form1
            this.Hide();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            // Your connection string
            string cnstring = "Data Source=DESKTOP-QR4BNH8\\SQLEXPRESS01;Initial Catalog=DBPROJECT;Integrated Security=True;Encrypt=false";



            try
            {


                SqlConnection con = new SqlConnection(cnstring);
                con.Open();
                SqlDataAdapter adapter = new SqlDataAdapter("SELECT * FROM Staff;", con);

                DataTable dt = new DataTable();
                adapter.Fill(dt);
                dataGridView1.DataSource = dt;
            }
            catch (Exception ex)
            {
                label2.Text = "Error: " + ex.Message;
            }
        }
    }
}
