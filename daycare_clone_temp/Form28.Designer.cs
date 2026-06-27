namespace DBPROJ4
{
    partial class Form28
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form28));
            button1 = new Button();
            label1 = new Label();
            textBox3 = new TextBox();
            button5 = new Button();
            textBox2 = new TextBox();
            button6 = new Button();
            textBox1 = new TextBox();
            pictureBox2 = new PictureBox();
            label2 = new Label();
            label3 = new Label();
            ((System.ComponentModel.ISupportInitialize)pictureBox2).BeginInit();
            SuspendLayout();
            // 
            // button1
            // 
            button1.Location = new Point(590, 349);
            button1.Name = "button1";
            button1.Size = new Size(75, 23);
            button1.TabIndex = 144;
            button1.Text = "Delete";
            button1.UseVisualStyleBackColor = true;
            button1.Click += button1_Click;
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Location = new Point(234, 349);
            label1.Name = "label1";
            label1.Size = new Size(131, 15);
            label1.TabIndex = 143;
            label1.Text = "Enter Staff Member's ID";
            // 
            // textBox3
            // 
            textBox3.Location = new Point(387, 346);
            textBox3.Name = "textBox3";
            textBox3.Size = new Size(174, 23);
            textBox3.TabIndex = 142;
            // 
            // button5
            // 
            button5.Location = new Point(421, 451);
            button5.Name = "button5";
            button5.Size = new Size(79, 23);
            button5.TabIndex = 141;
            button5.Text = "Back";
            button5.UseVisualStyleBackColor = true;
            button5.Click += button5_Click;
            // 
            // textBox2
            // 
            textBox2.Font = new Font("Segoe UI", 16F, FontStyle.Bold);
            textBox2.Location = new Point(271, 285);
            textBox2.Name = "textBox2";
            textBox2.Size = new Size(306, 36);
            textBox2.TabIndex = 140;
            textBox2.Text = "Delete Staff Member Record";
            textBox2.TextAlign = HorizontalAlignment.Center;
            // 
            // button6
            // 
            button6.Location = new Point(816, 472);
            button6.Name = "button6";
            button6.Size = new Size(75, 23);
            button6.TabIndex = 139;
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
            textBox1.TabIndex = 138;
            textBox1.Text = "Admin Dashboard";
            textBox1.TextAlign = HorizontalAlignment.Center;
            // 
            // pictureBox2
            // 
            pictureBox2.Image = (Image)resources.GetObject("pictureBox2.Image");
            pictureBox2.Location = new Point(14, 12);
            pictureBox2.Name = "pictureBox2";
            pictureBox2.Size = new Size(905, 187);
            pictureBox2.TabIndex = 137;
            pictureBox2.TabStop = false;
            // 
            // label2
            // 
            label2.AutoSize = true;
            label2.Location = new Point(709, 321);
            label2.Name = "label2";
            label2.Size = new Size(16, 15);
            label2.TabIndex = 145;
            label2.Text = "' '";
            // 
            // label3
            // 
            label3.AutoSize = true;
            label3.Location = new Point(714, 358);
            label3.Name = "label3";
            label3.Size = new Size(16, 15);
            label3.TabIndex = 146;
            label3.Text = "' '";
            // 
            // Form28
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.FromArgb(255, 192, 192);
            ClientSize = new Size(932, 507);
            Controls.Add(label3);
            Controls.Add(label2);
            Controls.Add(button1);
            Controls.Add(label1);
            Controls.Add(textBox3);
            Controls.Add(button5);
            Controls.Add(textBox2);
            Controls.Add(button6);
            Controls.Add(textBox1);
            Controls.Add(pictureBox2);
            Name = "Form28";
            Text = "Form28";
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
        private Label label3;
    }
}