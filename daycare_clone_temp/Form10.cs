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
using static System.Windows.Forms.VisualStyles.VisualStyleElement;

namespace DBPROJ4
{
    public partial class Form10 : Form
    {
        public Form10()
        {
            InitializeComponent();
        }

        private void button5_Click(object sender, EventArgs e)
        {
            string Name = textBox10.Text;
            string Email = textBox8.Text;
            string Password = textBox3.Text;
            string role = textBox9.Text;
            string phone = textBox4.Text;
            string staffid = textBox7.Text;

            // Your connection string
            string cnstring = "Data Source=DESKTOP-QR4BNH8\\SQLEXPRESS01;Initial Catalog=DBPROJECT;Integrated Security=True;Encrypt=false";

            // Your SQL query to insert data into the Admin table
            string sqlquery = "INSERT INTO Admin (Name, Role, Email, Password, StaffID) " +
                              "VALUES (@Name, @Role, @Email, @Password, @StaffID);";

            try
            {
                // Create a connection
                using (SqlConnection con = new SqlConnection(cnstring))
                {
                    con.Open();

                    // Initialize the command with the SQL query and connection
                    using (SqlCommand cm = new SqlCommand(sqlquery, con))
                    {
                        // Add parameters to the command
                        cm.Parameters.AddWithValue("@Name", Name);
                        cm.Parameters.AddWithValue("@Role", role);
                        cm.Parameters.AddWithValue("@Email", Email);
                        cm.Parameters.AddWithValue("@Password", Password);
                        //cm.Parameters.AddWithValue("@PhoneNo", phone);
                        cm.Parameters.AddWithValue("@StaffID", staffid);

                        // Execute the query
                        cm.ExecuteNonQuery();
                    }
                }

                label5.Text = "Signup was successful.";
            }
            catch (Exception ex)
            {
                label6.Text = "Error: " + ex.Message;
            }

        }

        private void button6_Click(object sender, EventArgs e)
        {
            Form9 form9 = new Form9();

            // Show Form6
            form9.Show();

            // Optionally, you can hide Form1
            this.Hide();

        }

        private void button3_Click(object sender, EventArgs e)
        {
            Form9 form9 = new Form9();

            // Show Form6
            form9.Show();

            // Optionally, you can hide Form1
            this.Hide();
        }
    }
}
