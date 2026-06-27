namespace DBPROJ4
{
    partial class Form6
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form6));
            button2 = new Button();
            button1 = new Button();
            textBox5 = new TextBox();
            label1 = new Label();
            textBox4 = new TextBox();
            textBox2 = new TextBox();
            textBox1 = new TextBox();
            pictureBox2 = new PictureBox();
            label2 = new Label();
            textBox3 = new TextBox();
            label3 = new Label();
            ((System.ComponentModel.ISupportInitialize)pictureBox2).BeginInit();
            SuspendLayout();
            // 
            // button2
            // 
            button2.Location = new Point(836, 472);
            button2.Name = "button2";
            button2.Size = new Size(75, 23);
            button2.TabIndex = 72;
            button2.Text = "Back";
            button2.UseVisualStyleBackColor = true;
            button2.Click += button2_Click;
            // 
            // button1
            // 
            button1.Location = new Point(675, 447);
            button1.Name = "button1";
            button1.Size = new Size(75, 23);
            button1.TabIndex = 71;
            button1.Text = "Submit";
            button1.UseVisualStyleBackColor = true;
            button1.Click += button1_Click;
            // 
            // textBox5
            // 
            textBox5.Location = new Point(282, 390);
            textBox5.Multiline = true;
            textBox5.Name = "textBox5";
            textBox5.Size = new Size(372, 80);
            textBox5.TabIndex = 70;
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Location = new Point(388, 335);
            label1.Name = "label1";
            label1.Size = new Size(0, 15);
            label1.TabIndex = 69;
            // 
            // textBox4
            // 
            textBox4.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            textBox4.Location = new Point(282, 344);
            textBox4.Name = "textBox4";
            textBox4.Size = new Size(372, 23);
            textBox4.TabIndex = 68;
            textBox4.Text = "Leave Your Feedback and Suggestions Here!";
            textBox4.TextAlign = HorizontalAlignment.Center;
            // 
            // textBox2
            // 
            textBox2.Font = new Font("Segoe UI", 18F, FontStyle.Bold, GraphicsUnit.Point, 0);
            textBox2.Location = new Point(316, 273);
            textBox2.Name = "textBox2";
            textBox2.Size = new Size(324, 39);
            textBox2.TabIndex = 67;
            textBox2.Text = "Feedback and Suggestions";
            textBox2.TextAlign = HorizontalAlignment.Center;
            // 
            // textBox1
            // 
            textBox1.Font = new Font("Segoe UI", 24F, FontStyle.Bold, GraphicsUnit.Point, 0);
            textBox1.Location = new Point(22, 217);
            textBox1.Name = "textBox1";
            textBox1.Size = new Size(889, 50);
            textBox1.TabIndex = 66;
            textBox1.Text = "Guardian Dashboard";
            textBox1.TextAlign = HorizontalAlignment.Center;
            // 
            // pictureBox2
            // 
            pictureBox2.Image = (Image)resources.GetObject("pictureBox2.Image");
            pictureBox2.Location = new Point(22, 12);
            pictureBox2.Name = "pictureBox2";
            pictureBox2.Size = new Size(889, 186);
            pictureBox2.TabIndex = 65;
            pictureBox2.TabStop = false;
            // 
            // label2
            // 
            label2.AutoSize = true;
            label2.Location = new Point(87, 393);
            label2.Name = "label2";
            label2.Size = new Size(155, 15);
            label2.TabIndex = 73;
            label2.Text = "Enter your Guardian ID here:";
            // 
            // textBox3
            // 
            textBox3.Location = new Point(116, 424);
            textBox3.Name = "textBox3";
            textBox3.Size = new Size(100, 23);
            textBox3.TabIndex = 74;
            // 
            // label3
            // 
            label3.AutoSize = true;
            label3.Location = new Point(719, 393);
            label3.Name = "label3";
            label3.Size = new Size(16, 15);
            label3.TabIndex = 75;
            label3.Text = "' '";
            // 
            // Form6
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.FromArgb(255, 192, 192);
            ClientSize = new Size(932, 507);
            Controls.Add(label3);
            Controls.Add(textBox3);
            Controls.Add(label2);
            Controls.Add(button2);
            Controls.Add(button1);
            Controls.Add(textBox5);
            Controls.Add(label1);
            Controls.Add(textBox4);
            Controls.Add(textBox2);
            Controls.Add(textBox1);
            Controls.Add(pictureBox2);
            Name = "Form6";
            Text = "Form6";
            ((System.ComponentModel.ISupportInitialize)pictureBox2).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Button button2;
        private Button button1;
        private TextBox textBox5;
        private Label label1;
        private TextBox textBox4;
        private TextBox textBox2;
        private TextBox textBox1;
        private PictureBox pictureBox2;
        private Label label2;
        private TextBox textBox3;
        private Label label3;
    }
}