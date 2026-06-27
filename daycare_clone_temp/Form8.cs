using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.Data.Sql;
using Microsoft.Data.SqlClient;
using static System.Runtime.InteropServices.JavaScript.JSType;
namespace DBPROJ4
{
    public partial class Form8 : Form
    {
        public Form8()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            // Create an instance of Form5
            Form9 form9 = new Form9();

            // Show Form6
            form9.Show();

            // Optionally, you can hide Form1
            this.Hide();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            string Name = textBox1.Text;
            string Email = textBox2.Text;
            string Password = textBox8.Text;
            string PhoneNo = textBox4.Text;
            string RelationshipToChild = textBox7.Text;
            int ChildID = int.Parse(textBox3.Text); // Convert string to int

            // Your connection string
            string cnstring = "Data Source=DESKTOP-QR4BNH8\\SQLEXPRESS01;Initial Catalog=DBPROJECT;Integrated Security=True;Encrypt=false";

            // Your SQL query to insert data into the Guardian table
            string sqlquery = "INSERT INTO Guardian (Name, Email, RelationshipToChild, Password, PhoneNo, ChildID) " +
                              "VALUES (@Name, @Email, @RelationshipToChild, @Password, @PhoneNo, @ChildID);";

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
                        cm.Parameters.AddWithValue("@Email", Email);
                        cm.Parameters.AddWithValue("@RelationshipToChild", RelationshipToChild);
                        cm.Parameters.AddWithValue("@Password", Password);
                        cm.Parameters.AddWithValue("@PhoneNo", PhoneNo);
                        cm.Parameters.AddWithValue("@ChildID", ChildID);

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
    }
}

