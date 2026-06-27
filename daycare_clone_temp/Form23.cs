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
    public partial class Form23 : Form
    {
        public Form23()
        {
            InitializeComponent();
        }

        private void button5_Click(object sender, EventArgs e)
        {
            // Create an instance of Form5
            Form19 form19 = new Form19();

            // Show Form6
            form19.Show();

            // Optionally, you can hide Form1
            this.Hide();
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

        private void button1_Click(object sender, EventArgs e)
        {
            string ID = textBox3.Text;
            if (string.IsNullOrWhiteSpace(ID))
            {
                textBox1.Text = "Please enter ID.";
                return;
            }

            // Your connection string
            string cnstring = "Data Source=DESKTOP-QR4BNH8\\SQLEXPRESS01;Initial Catalog=DBPROJECT;Integrated Security=True;Encrypt=false";

            // Your SQL query
            string sqlquery = "DELETE FROM Child WHERE ChildID= " + ID;

            try
            {
                // Create a connection
                using (SqlConnection con = new SqlConnection(cnstring))
                {
                    con.Open();

                    // Create a command with the SQL query and the connection
                    using (SqlCommand cm = new SqlCommand(sqlquery, con))
                    {
                        // Add parameters to the command
                        cm.Parameters.AddWithValue("@ID", ID);


                        // Execute the query
                        cm.ExecuteNonQuery();
                    }
                }

                label2.Text = "Record deleted successfully.";
            }
            catch (Exception ex)
            {
                label2.Text = "Error: " + ex.Message;
            }

        }
    }
}
