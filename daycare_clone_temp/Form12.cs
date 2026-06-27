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
    public partial class Form12 : Form
    {
        public Form12()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            string communicationChannel = "Text"; // Default communication channel
            string message = textBox5.Text.Trim(); // Message entered by the guardian
            DateTime timestamp = DateTime.Now; // Current timestamp
            string feedback = ""; // Empty feedback initially
            int guardianID = int.Parse(textBox3.Text.Trim()); // Guardian ID entered by the user
            int staffID = 1; // Default staff ID

            // Your connection string
            string cnstring = "Data Source=DESKTOP-QR4BNH8\\SQLEXPRESS01;Initial Catalog=DBPROJECT;Integrated Security=True;Encrypt=false";

            // Your SQL query to insert a new communication record
            string sqlquery = @"INSERT INTO Communication (CommunicationChannel, Message, Timestamp, Feedback, GuardianID, StaffID)
                    VALUES (@CommunicationChannel, @Message, @Timestamp, @Feedback, @GuardianID, @StaffID)";

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
                        cm.Parameters.AddWithValue("@CommunicationChannel", communicationChannel);
                        cm.Parameters.AddWithValue("@Message", message);
                        cm.Parameters.AddWithValue("@Timestamp", timestamp);
                        cm.Parameters.AddWithValue("@Feedback", feedback);
                        cm.Parameters.AddWithValue("@GuardianID", guardianID);
                        cm.Parameters.AddWithValue("@StaffID", staffID);

                        // Execute the query
                        cm.ExecuteNonQuery();
                    }
                }

                // Display success message
                MessageBox.Show("Message sent successfully.");
            }
            catch (Exception ex)
            {
                // Display error message
                MessageBox.Show("Error: " + ex.Message);
            }
        }

        private void button2_Click(object sender, EventArgs e)
        {
            Form5 form5 = new Form5();

            // Show Form6
            form5.Show();

            // Optionally, you can hide Form1
            this.Hide();
        }
    }
}
