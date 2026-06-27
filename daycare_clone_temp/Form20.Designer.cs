namespace DBPROJ4
{
    partial class Form20
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form20));
            button5 = new Button();
            textBox2 = new TextBox();
            button6 = new Button();
            textBox1 = new TextBox();
            pictureBox2 = new PictureBox();
            textBox3 = new TextBox();
            comboBox2 = new ComboBox();
            dateTimePicker2 = new DateTimePicker();
            label1 = new Label();
            label5 = new Label();
            label6 = new Label();
            button1 = new Button();
            label2 = new Label();
            textBox4 = new TextBox();
            textBox5 = new TextBox();
            textBox6 = new TextBox();
            label3 = new Label();
            label4 = new Label();
            label7 = new Label();
            ((System.ComponentModel.ISupportInitialize)pictureBox2).BeginInit();
            SuspendLayout();
            // 
            // button5
            // 
            button5.Location = new Point(791, 380);
            button5.Name = "button5";
            button5.Size = new Size(114, 23);
            button5.TabIndex = 92;
            button5.Text = "Enroll Child";
            button5.UseVisualStyleBackColor = true;
            button5.Click += button5_Click;
            // 
            // textBox2
            // 
            textBox2.Font = new Font("Segoe UI", 16F, FontStyle.Bold);
            textBox2.Location = new Point(271, 285);
            textBox2.Name = "textBox2";
            textBox2.Size = new Size(306, 36);
            textBox2.TabIndex = 91;
            textBox2.Text = "Enroll Children";
            textBox2.TextAlign = HorizontalAlignment.Center;
            // 
            // button6
            // 
            button6.Location = new Point(802, 244);
            button6.Name = "button6";
            button6.Size = new Size(75, 23);
            button6.TabIndex = 90;
            button6.Text = "Logout";
            button6.UseVisualStyleBackColor = true;
            button6.Click += button6_Click;
            // 
            // textBox1
            // 
            textBox1.Font = new Font("Segoe UI", 24F, FontStyle.Bold, GraphicsUnit.Point, 0);
            textBox1.Location = new Point(176, 217);
            textBox1.Name = "textBox1";
            textBox1.Size = new Size(489, 50);
            textBox1.TabIndex = 89;
            textBox1.Text = "Admin Dashboard";
            textBox1.TextAlign = HorizontalAlignment.Center;
            // 
            // pictureBox2
            // 
            pictureBox2.Image = (Image)resources.GetObject("pictureBox2.Image");
            pictureBox2.Location = new Point(14, 12);
            pictureBox2.Name = "pictureBox2";
            pictureBox2.Size = new Size(905, 187);
            pictureBox2.TabIndex = 88;
            pictureBox2.TabStop = false;
            // 
            // textBox3
            // 
            textBox3.Location = new Point(271, 385);
            textBox3.Name = "textBox3";
            textBox3.Size = new Size(174, 23);
            textBox3.TabIndex = 104;
            // 
            // comboBox2
            // 
            comboBox2.FormattingEnabled = true;
            comboBox2.Items.AddRange(new object[] { "Male", "Female" });
            comboBox2.Location = new Point(271, 431);
            comboBox2.Name = "comboBox2";
            comboBox2.Size = new Size(174, 23);
            comboBox2.TabIndex = 105;
            comboBox2.SelectedIndexChanged += comboBox2_SelectedIndexChanged;
            // 
            // dateTimePicker2
            // 
            dateTimePicker2.Location = new Point(271, 476);
            dateTimePicker2.Name = "dateTimePicker2";
            dateTimePicker2.Size = new Size(200, 23);
            dateTimePicker2.TabIndex = 106;
            dateTimePicker2.ValueChanged += dateTimePicker2_ValueChanged;
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Location = new Point(121, 385);
            label1.Name = "label1";
            label1.Size = new Size(108, 15);
            label1.TabIndex = 107;
            label1.Text = "Enter Child's Name";
            // 
            // label5
            // 
            label5.AutoSize = true;
            label5.Location = new Point(135, 431);
            label5.Name = "label5";
            label5.Size = new Size(79, 15);
            label5.TabIndex = 108;
            label5.Text = "Select Gender";
            // 
            // label6
            // 
            label6.AutoSize = true;
            label6.Location = new Point(121, 476);
            label6.Name = "label6";
            label6.Size = new Size(144, 15);
            label6.TabIndex = 109;
            label6.Text = "Enter Child's Date Of Birth";
            // 
            // button1
            // 
            button1.Location = new Point(41, 298);
            button1.Name = "button1";
            button1.Size = new Size(75, 23);
            button1.TabIndex = 110;
            button1.Text = "Back";
            button1.UseVisualStyleBackColor = true;
            button1.Click += button1_Click;
            // 
            // label2
            // 
            label2.AutoSize = true;
            label2.Location = new Point(714, 306);
            label2.Name = "label2";
            label2.Size = new Size(20, 15);
            label2.TabIndex = 111;
            label2.Text = "\" \"";
            // 
            // textBox4
            // 
            textBox4.Location = new Point(623, 419);
            textBox4.Name = "textBox4";
            textBox4.Size = new Size(148, 23);
            textBox4.TabIndex = 112;
            // 
            // textBox5
            // 
            textBox5.Location = new Point(623, 468);
            textBox5.Name = "textBox5";
            textBox5.Size = new Size(148, 23);
            textBox5.TabIndex = 113;
            // 
            // textBox6
            // 
            textBox6.Location = new Point(623, 381);
            textBox6.Name = "textBox6";
            textBox6.Size = new Size(148, 23);
            textBox6.TabIndex = 114;
            // 
            // label3
            // 
            label3.AutoSize = true;
            label3.Location = new Point(483, 384);
            label3.Name = "label3";
            label3.Size = new Size(118, 15);
            label3.TabIndex = 115;
            label3.Text = "Medical Information:";
            // 
            // label4
            // 
            label4.AutoSize = true;
            label4.Location = new Point(482, 422);
            label4.Name = "label4";
            label4.Size = new Size(95, 15);
            label4.TabIndex = 116;
            label4.Text = "Allergies (if any):";
            // 
            // label7
            // 
            label7.AutoSize = true;
            label7.Location = new Point(494, 474);
            label7.Name = "label7";
            label7.Size = new Size(123, 15);
            label7.TabIndex = 117;
            label7.Text = "Dietery Requirements:";
            // 
            // Form20
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.FromArgb(255, 192, 192);
            ClientSize = new Size(932, 507);
            Controls.Add(label7);
            Controls.Add(label4);
            Controls.Add(label3);
            Controls.Add(textBox6);
            Controls.Add(textBox5);
            Controls.Add(textBox4);
            Controls.Add(label2);
            Controls.Add(button1);
            Controls.Add(label6);
            Controls.Add(label5);
            Controls.Add(label1);
            Controls.Add(dateTimePicker2);
            Controls.Add(comboBox2);
            Controls.Add(textBox3);
            Controls.Add(button5);
            Controls.Add(textBox2);
            Controls.Add(button6);
            Controls.Add(textBox1);
            Controls.Add(pictureBox2);
            Name = "Form20";
            Text = "Form20";
            ((System.ComponentModel.ISupportInitialize)pictureBox2).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion
        private Button button5;
        private TextBox textBox2;
        private Button button6;
        private TextBox textBox1;
        private PictureBox pictureBox2;
        private TextBox textBox3;
        private ComboBox comboBox2;
        private DateTimePicker dateTimePicker2;
        private Label label1;
        private Label label5;
        private Label label6;
        private Button button1;
        private Label label2;
        private TextBox textBox4;
        private TextBox textBox5;
        private TextBox textBox6;
        private Label label3;
        private Label label4;
        private Label label7;
    }
}