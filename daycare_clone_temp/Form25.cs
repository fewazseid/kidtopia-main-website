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
    public partial class Form25 : Form
    {
        public Form25()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            // Create an instance of Form5
            Form24 form24 = new Form24();

            // Show Form6
            form24.Show();

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

        private void button5_Click(object sender, EventArgs e)
        {
            string name = textBox2.Text;
            string role = textBox2.Text;
            string email = textBox5.Text;
                string pass = textBox6.Text;
                string phone = textBox7.Text;

            if (string.IsNullOrWhiteSpace(name))
            {
                textBox3.Text = "Please enter name.";
                return;
            }

            if (string.IsNullOrWhiteSpace(role))
            {
                textBox4.Text = "Please enter role.";
                return;
            }

            // Your connection string
            string cnstring = "Data Source=DESKTOP-QR4BNH8\\SQLEXPRESS01;Initial Catalog=DBPROJECT;Integrated Security=True;Encrypt=false";

            // Your SQL query
            string sqlquery = "INSERT INTO Staff (Name, Role,Email,Password,PhoneNo) VALUES ('" + Name + "','" + role + "','"+email+"','"+pass+"','"+phone+"')";


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
                        cm.Parameters.AddWithValue("@Name", Name);
                        cm.Parameters.AddWithValue("@Role", role);
                        cm.Parameters.AddWithValue("@Email", email);
                        cm.Parameters.AddWithValue("@Password",pass);
                        cm.Parameters.AddWithValue("@PhoneNo", phone);





                        // Execute the query
                        cm.ExecuteNonQuery();
                    }
                }

                label3.Text = "Record inserted successfully.";
            }
            catch (Exception ex)
            {
                label2.Text = "Error: " + ex.Message;
            }
        }
    }
}
