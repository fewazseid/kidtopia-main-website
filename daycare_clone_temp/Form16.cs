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
    public partial class Form16 : Form
    {
        public Form16()
        {
            InitializeComponent();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            Form5 form5 = new Form5();

            // Show Form6
            form5.Show();

            // Optionally, you can hide Form1
            this.Hide();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            string childName = textBox4.Text.Trim();

            // Your connection string
            string cnstring = "Data Source=DESKTOP-QR4BNH8\\SQLEXPRESS01;Initial Catalog=DBPROJECT;Integrated Security=True;Encrypt=false";

            // Your SQL query to fetch attendance records for the specified child
            string sqlquery = @"SELECT c.Name AS ChildName,
                               a.CheckIn,
                               a.CheckOut
                        FROM Attendance a
                        JOIN Child c ON a.ChildID = c.ChildID
                        WHERE c.Name = @ChildName";

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
                        cm.Parameters.AddWithValue("@ChildName", childName);

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
