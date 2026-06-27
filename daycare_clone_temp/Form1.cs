namespace DBPROJ4
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            // Create an instance of Form5
            Form2 form2 = new Form2();

            // Show Form6
            form2.Show();

            // Optionally, you can hide Form1
            this.Hide();
        }

        private void button3_Click(object sender, EventArgs e)
        {
            // Create an instance of Form5
            Form3 form3 = new Form3();

            // Show Form6
            form3.Show();

            // Optionally, you can hide Form1
            this.Hide();
        }

        private void button4_Click(object sender, EventArgs e)
        {
            // Create an instance of Form5
            Form4 form4 = new Form4();

            // Show Form6
            form4.Show();

            // Optionally, you can hide Form1
            this.Hide();
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
    }
}
