namespace DBPROJ4
{
    partial class Form23
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form23));
            button1 = new Button();
            label1 = new Label();
            textBox3 = new TextBox();
            button5 = new Button();
            textBox2 = new TextBox();
            button6 = new Button();
            textBox1 = new TextBox();
            pictureBox2 = new PictureBox();
            label2 = new Label();
            ((System.ComponentModel.ISupportInitialize)pictureBox2).BeginInit();
            SuspendLayout();
            // 
            // button1
            // 
            button1.Location = new Point(590, 348);
            button1.Name = "button1";
            button1.Size = new Size(75, 23);
            button1.TabIndex = 136;
            button1.Text = "Delete";
            button1.UseVisualStyleBackColor = true;
            button1.Click += button1_Click;
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Location = new Point(234, 348);
            label1.Name = "label1";
            label1.Size = new Size(87, 15);
            label1.TabIndex = 133;
            label1.Text = "Enter Child's ID";
            // 
            // textBox3
            // 
            textBox3.Location = new Point(387, 345);
            textBox3.Name = "textBox3";
            textBox3.Size = new Size(174, 23);
            textBox3.TabIndex = 130;
            // 
            // button5
            // 
            button5.Location = new Point(421, 450);
            button5.Name = "button5";
            button5.Size = new Size(79, 23);
            button5.TabIndex = 129;
            button5.Text = "Back";
            button5.UseVisualStyleBackColor = true;
            button5.Click += button5_Click;
            // 
            // textBox2
            // 
            textBox2.Font = new Font("Segoe UI", 16F, FontStyle.Bold);
            textBox2.Location = new Point(271, 284);
            textBox2.Name = "textBox2";
            textBox2.Size = new Size(306, 36);
            textBox2.TabIndex = 128;
            textBox2.Text = "Delete Child Record";
            textBox2.TextAlign = HorizontalAlignment.Center;
            // 
            // button6
            // 
            button6.Location = new Point(816, 471);
            button6.Name = "button6";
            button6.Size = new Size(75, 23);
            button6.TabIndex = 127;
            button6.Text = "Logout";
            button6.UseVisualStyleBackColor = true;
            button6.Click += button6_Click;
            // 
            // textBox1
            // 
            textBox1.Font = new Font("Segoe UI", 24F, FontStyle.Bold, GraphicsUnit.Point, 0);
            textBox1.Location = new Point(176, 216);
            textBox1.Name = "textBox1";
            textBox1.Size = new Size(489, 50);
            textBox1.TabIndex = 126;
            textBox1.Text = "Admin Dashboard";
            textBox1.TextAlign = HorizontalAlignment.Center;
            // 
            // pictureBox2
            // 
            pictureBox2.Image = (Image)resources.GetObject("pictureBox2.Image");
            pictureBox2.Location = new Point(14, 11);
            pictureBox2.Name = "pictureBox2";
            pictureBox2.Size = new Size(905, 187);
            pictureBox2.TabIndex = 125;
            pictureBox2.TabStop = false;
            // 
            // label2
            // 
            label2.AutoSize = true;
            label2.Location = new Point(726, 305);
            label2.Name = "label2";
            label2.Size = new Size(20, 15);
            label2.TabIndex = 137;
            label2.Text = "\" \"";
            // 
            // Form23
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.FromArgb(255, 192, 192);
            ClientSize = new Size(932, 507);
            Controls.Add(label2);
            Controls.Add(button1);
            Controls.Add(label1);
            Controls.Add(textBox3);
            Controls.Add(button5);
            Controls.Add(textBox2);
            Controls.Add(button6);
            Controls.Add(textBox1);
            Controls.Add(pictureBox2);
            Name = "Form23";
            Text = "Form23";
            ((System.ComponentModel.ISupportInitialize)pictureBox2).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion
        private Button button1;
        private Label label1;
        private TextBox textBox3;
        private Button button5;
        private TextBox textBox2;
        private Button button6;
        private TextBox textBox1;
        private PictureBox pictureBox2;
        private Label label2;
    }
}