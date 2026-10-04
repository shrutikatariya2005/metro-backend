// src/services/MailService.js
import nodemailer from "nodemailer";

class MailService {
  constructor() {
    this.transporter = null;
  }

  async getTransporter() {
    if (this.transporter) return this.transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Dynamically generate a test account if credentials expire or are not provided
      console.log("Generating a new Ethereal test account...");
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }
    return this.transporter;
  }

  async sendOTP(toEmail, otp) {
    const transporter = await this.getTransporter();
    const info = await transporter.sendMail({
      from: '"Metro Booking System" <noreply@metro.com>',
      to: toEmail,
      subject: "Password Reset OTP - Metro Booking",
      text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
      html: `<h2>Metro Booking System</h2><p>Your OTP for password reset is: <strong>${otp}</strong></p><p>It is valid for 10 minutes.</p>`,
    });
    console.log("✉️ OTP Email sent: %s", info.messageId);
    console.log("🔗 Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
}

export default new MailService();
