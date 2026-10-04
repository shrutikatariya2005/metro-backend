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
      from: `"Metro Transit System" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Password Reset Verification Code - Metro Transit",
      html: `
        <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:520px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;padding:32px;background:#ffffff;box-shadow:0 4px 12px rgba(0,0,0,0.05)">
          <div style="text-align:center;margin-bottom:24px">
            <h2 style="color:#0f172a;margin:0;font-size:24px;font-weight:700">Metro Transit System</h2>
            <p style="color:#64748b;font-size:14px;margin-top:4px">Password Reset Request</p>
          </div>
          <div style="background:#f8fafc;border-radius:8px;padding:20px;margin-bottom:24px">
            <p style="color:#334155;font-size:15px;margin:0 0 12px 0">We received a request to reset the password for your account linked to <strong>${toEmail}</strong>.</p>
            <p style="color:#334155;font-size:15px;margin:0">Use the 6-digit code below to proceed with resetting your password:</p>
            <div style="font-size:38px;font-weight:800;letter-spacing:10px;color:#2563eb;text-align:center;padding:20px 0;margin:16px 0;background:#ffffff;border:1px dashed #cbd5e1;border-radius:8px">${otp}</div>
            <p style="color:#e11d48;font-size:13px;margin:0;text-align:center;font-weight:600">⏱️ This OTP code is valid for 10 minutes only.</p>
          </div>
          <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
        </div>
      `,
    });
    console.log(`✉️  OTP sent to ${toEmail}`);
  }

  async sendTicketEmail(toEmail, booking, ticketRef, qrCodeBase64, validUntil) {
    try {
      const transporter = this.getTransporter();
      const formattedDate = new Date(validUntil).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      });

      await transporter.sendMail({
        from: `"Metro Transit System" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `🎫 Your Metro Ticket - Ref: ${ticketRef}`,
        html: `
          <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:550px;margin:auto;border:1px solid #e2e8f0;border-radius:16px;padding:32px;background:#ffffff;box-shadow:0 8px 24px rgba(0,0,0,0.06)">
            <div style="text-align:center;border-bottom:2px dashed #e2e8f0;padding-bottom:20px;margin-bottom:24px">
              <span style="background:#dbeafe;color:#1d4ed8;font-weight:700;font-size:12px;padding:4px 12px;border-radius:12px;text-transform:uppercase;letter-spacing:1px">E-Ticket Confirmed</span>
              <h2 style="color:#0f172a;margin:12px 0 4px 0;font-size:26px">Metro Rapid Transit</h2>
              <p style="color:#64748b;font-size:14px;margin:0">Ticket Reference: <strong style="color:#2563eb">${ticketRef}</strong></p>
            </div>

            <div style="text-align:center;margin:24px 0;padding:20px;background:#f8fafc;border-radius:12px">
              <p style="color:#475569;font-size:13px;font-weight:600;margin:0 0 12px 0;text-transform:uppercase;letter-spacing:0.5px">Scan at Metro Gate</p>
              <img src="${qrCodeBase64}" alt="QR Ticket Code" style="width:200px;height:200px;border:4px solid #ffffff;border-radius:12px;box-shadow:0 4px 10px rgba(0,0,0,0.08)" />
              <div style="margin-top:14px;display:inline-block;background:#fee2e2;color:#991b1b;font-size:13px;font-weight:600;padding:6px 16px;border-radius:20px">
                ⏳ Valid for 2 Hours (Expires: ${formattedDate})
              </div>
            </div>

            <div style="background:#f1f5f9;border-radius:12px;padding:20px;margin-bottom:24px">
              <h4 style="margin:0 0 12px 0;color:#1e293b;font-size:15px;border-bottom:1px solid #cbd5e1;padding-bottom:8px">Journey Details</h4>
              <table style="width:100%;font-size:14px;color:#334155;border-collapse:collapse">
                <tr>
                  <td style="padding:6px 0;color:#64748b">From Station:</td>
                  <td style="padding:6px 0;text-align:right;font-weight:600;color:#0f172a">${booking.fromStation?.name || booking.fromStation}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#64748b">To Station:</td>
                  <td style="padding:6px 0;text-align:right;font-weight:600;color:#0f172a">${booking.toStation?.name || booking.toStation}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#64748b">Passengers:</td>
                  <td style="padding:6px 0;text-align:right;font-weight:600;color:#0f172a">${booking.passengers || 1} Person(s)</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#64748b">Total Paid:</td>
                  <td style="padding:6px 0;text-align:right;font-weight:700;color:#16a34a;font-size:16px">₹${booking.fareAmount}</td>
                </tr>
              </table>
            </div>

            <div style="text-align:center;color:#94a3b8;font-size:12px">
              <p style="margin:0">Thank you for traveling with Metro Rapid Transit.</p>
              <p style="margin:4px 0 0 0">Please present this QR code at the entry gates.</p>
            </div>
          </div>
        `,
      });
      console.log(`✉️ Ticket QR Email successfully sent to ${toEmail}`);
    } catch (err) {
      console.error("Failed to send ticket email:", err.message);
      // Non-blocking error so ticket flow still succeeds
    }
  }
}

export default new MailService();

