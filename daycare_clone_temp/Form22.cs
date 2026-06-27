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
using static System.Runtime.InteropServices.JavaScript.JSType;
using static System.Windows.Forms.VisualStyles.VisualStyleElement;

namespace DBPROJ4
{
    public partial class Form22 : Form
    {
        string Selection = "";
        string date = " ";
        public Form22()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
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

        private void button5_Click(object sender, EventArgs e)
        {
            string ID = textBox3.Text;
            string Name = textBox4.Text;
            string med = textBox5.Text;
            string all = textBox6.Text;
            string diet = textBox7.Text;

            //if (string.IsNullOrWhiteSpace(ID))
            //{
            //    label3.Text = "Please enter ID.";
            //    return;
            //}

            //if (string.IsNullOrWhiteSpace(Name))
            //{
            //    label4.Text = "Please enter Name.";
            //    return;
            //}

            // Your connection string
            string cnstring = "Data Source=DESKTOP-QR4BNH8\\SQLEXPRESS01;Initial Catalog=DBPROJECT;Integrated Security=True;Encrypt=false";

            // Your SQL query
            string sqlquery = "UPDATE Child SET Name = @Name, Gender = @Gender, DateOfBirth = @DateOfBirth, MedicalInfo = @MedicalInfo, Allergies = @Allergies, DietaryRequirements = @DietaryRequirements WHERE ChildID = @ID";

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
                        cm.Parameters.AddWithValue("@Gender", Selection);
                        cm.Parameters.AddWithValue("@DateOfBirth", dateTimePicker2.Value.ToString("yyyy-MM-dd"));
                        cm.Parameters.AddWithValue("@MedicalInfo", med);
                        cm.Parameters.AddWithValue("@Allergies", all);
                        cm.Parameters.AddWithValue("@DietaryRequirements", diet);
                        cm.Parameters.AddWithValue("@ID", ID);

                        // Execute the query
                        cm.ExecuteNonQuery();
                    }
                }

                label3.Text = "Record updated successfully.";
            }
            catch (Exception ex)
            {
                label4.Text = "Error: " + ex.Message;
            }
        }

        private void comboBox2_SelectedIndexChanged(object sender, EventArgs e)
        {
            Selection = comboBox2.SelectedItem.ToString();
        }

        private void dateTimePicker2_ValueChanged(object sender, EventArgs e)
        {
            date = dateTimePicker2.ToString();
        }
    }
}
