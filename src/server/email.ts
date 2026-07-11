import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, html: string, replyTo?: string, fromDisplay?: string) {
    const GMAIL_USER = process.env.GMAIL_USER;
    const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
        throw new Error('Email configuration missing on server.');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_APP_PASSWORD
        }
    });

    const from = fromDisplay || `"Kidtopia Daycare" <${GMAIL_USER}>`;

    await transporter.sendMail({
        from: from,
        replyTo: replyTo || GMAIL_USER,
        to: to,
        subject: subject,
        html: html
    });
}
