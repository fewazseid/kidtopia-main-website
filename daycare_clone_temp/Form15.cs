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
    public partial class Form15 : Form
    {
        public Form15()
        {
            InitializeComponent();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            // Create an instance of Form5
            Form14 form14 = new Form14();

            // Show Form6
            form14.Show();

            // Optionally, you can hide Form1
            this.Hide();
        }

        private void button1_Click(object sender, EventArgs e)
        {


            // Parse the childid as an integer
            if (!int.TryParse(textBox4.Text, out int childid))
            {
                MessageBox.Show("Please enter a valid child ID.");
                return;
            }

            // Your connection string
            string cnstring = "Data Source=DESKTOP-QR4BNH8\\SQLEXPRESS01;Initial Catalog=DBPROJECT;Integrated Security=True;Encrypt=false";

            // Your SQL query to fetch attendance records for the specified child
            string sqlquery = "SELECT * FROM Child WHERE ChildID = @ChildID";

            try
            {
                // Create a connection
                using (SqlConnection con = new SqlConnection(cnstring))
                {
                    con.Open();

                    // Create a command with the SQL query and the connection
                    using (SqlCommand cm = new SqlCommand(sqlquery, con))
                    {
                        // Add parameter to the command
                        cm.Parameters.AddWithValue("@ChildID", childid); // Fixed parameter name

                        // Create a SqlDataAdapter to fetch the data
                        SqlDataAdapter adapter = new SqlDataAdapter(cm);

                        // Create a DataTable to hold the fetched data
                        DataTable dataTable = new DataTable();

                        // Fill the DataTable with the data from the SqlDataAdapter
                        adapter.Fill(dataTable);

                        // Bind the DataTable to the DataGridView
                        dataGridView1.DataSource = dataTable;
                    }
                }

                label3.Text = "Data fetched successfully.";
            }
            catch (Exception ex)
            {
                label4.Text = "Error: " + ex.Message;
            }
        }

    }
}

