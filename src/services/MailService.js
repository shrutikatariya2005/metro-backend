// src/services/MailService.js
import nodemailer from "nodemailer";

class MailService {
  constructor() {
    this.transporter = null;
  }

  getTransporter() {
    if (this.transporter) return this.transporter;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("EMAIL_USER and EMAIL_PASS environment variables are not set.");
    }

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    return this.transporter;
  }

  async sendOTP(toEmail, otp) {
    const transporter = this.getTransporter();
    await transporter.sendMail({
      from: `"Metro Booking System" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Password Reset OTP - Metro Booking",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;border:1px solid #eee;border-radius:8px;padding:32px">
          <h2 style="color:#0f1117;margin-bottom:8px">Metro Booking System</h2>
          <p style="color:#555">You requested a password reset. Use the OTP below:</p>
          <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#f59e0b;text-align:center;padding:24px 0">${otp}</div>
          <p style="color:#555">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
          <p style="color:#aaa;font-size:12px">If you did not request a password reset, ignore this email.</p>
        </div>
      `,
    });
    console.log(`✉️  OTP sent to ${toEmail}`);
  }
}

export default new MailService();
