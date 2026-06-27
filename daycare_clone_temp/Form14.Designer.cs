namespace DBPROJ4
{
    partial class Form14
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form14));
            button6 = new Button();
            button5 = new Button();
            button4 = new Button();
            button3 = new Button();
            button2 = new Button();
            button1 = new Button();
            textBox1 = new TextBox();
            pictureBox2 = new PictureBox();
            ((System.ComponentModel.ISupportInitialize)pictureBox2).BeginInit();
            SuspendLayout();
            // 
            // button6
            // 
            button6.Location = new Point(816, 472);
            button6.Name = "button6";
            button6.Size = new Size(75, 23);
            button6.TabIndex = 70;
            button6.Text = "Logout";
            button6.UseVisualStyleBackColor = true;
            button6.Click += button6_Click;
            // 
            // button5
            // 
            button5.Location = new Point(390, 472);
            button5.Name = "button5";
            button5.Size = new Size(205, 23);
            button5.TabIndex = 69;
            button5.Text = "Communication Center";
            button5.UseVisualStyleBackColor = true;
            // 
            // button4
            // 
            button4.Location = new Point(390, 428);
            button4.Name = "button4";
            button4.Size = new Size(205, 23);
            button4.TabIndex = 68;
            button4.Text = "Record Attendance";
            button4.UseVisualStyleBackColor = true;
            // 
            // button3
            // 
            button3.Location = new Point(390, 388);
            button3.Name = "button3";
            button3.Size = new Size(205, 23);
            button3.TabIndex = 67;
            button3.Text = "Edit Child Details";
            button3.UseVisualStyleBackColor = true;
            // 
            // button2
            // 
            button2.Location = new Point(390, 339);
            button2.Name = "button2";
            button2.Size = new Size(205, 23);
            button2.TabIndex = 66;
            button2.Text = "View Child Details";
            button2.UseVisualStyleBackColor = true;
            button2.Click += button2_Click;
            // 
            // button1
            // 
            button1.Location = new Point(390, 297);
            button1.Name = "button1";
            button1.Size = new Size(205, 23);
            button1.TabIndex = 65;
            button1.Text = "Enroll Child";
            button1.UseVisualStyleBackColor = true;
            // 
            // textBox1
            // 
            textBox1.Font = new Font("Segoe UI", 24F, FontStyle.Bold, GraphicsUnit.Point, 0);
            textBox1.Location = new Point(14, 217);
            textBox1.Name = "textBox1";
            textBox1.Size = new Size(905, 50);
            textBox1.TabIndex = 64;
            textBox1.Text = "Staff Dashboard";
            textBox1.TextAlign = HorizontalAlignment.Center;
            // 
            // pictureBox2
            // 
            pictureBox2.Image = (Image)resources.GetObject("pictureBox2.Image");
            pictureBox2.Location = new Point(14, 12);
            pictureBox2.Name = "pictureBox2";
            pictureBox2.Size = new Size(905, 187);
            pictureBox2.TabIndex = 63;
            pictureBox2.TabStop = false;
            // 
            // Form14
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.FromArgb(255, 192, 192);
            ClientSize = new Size(932, 507);
            Controls.Add(button6);
            Controls.Add(button5);
            Controls.Add(button4);
            Controls.Add(button3);
            Controls.Add(button2);
            Controls.Add(button1);
            Controls.Add(textBox1);
            Controls.Add(pictureBox2);
            Name = "Form14";
            Text = "Form14";
            ((System.ComponentModel.ISupportInitialize)pictureBox2).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Button button6;
        private Button button5;
        private Button button4;
        private Button button3;
        private Button button2;
        private Button button1;
        private TextBox textBox1;
        private PictureBox pictureBox2;
    }
}