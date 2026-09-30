import nodemailer from "nodemailer";

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

export async function sendEmail({ to, subject, html }) {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn(`[email skipped] ${subject} -> ${to}`);
    return;
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    html
  });
}

export function appointmentEmail({ patientName, doctorName, date, time, status }) {
  const action = status === "cancelled" ? "cancelled" : "confirmed";
  return {
    subject: `MediBook appointment ${action}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:28px;color:#17324d">
        <h2 style="color:#0f766e">MediBook Pro</h2>
        <p>Hi ${patientName},</p>
        <p>Your appointment with <strong>Dr. ${doctorName}</strong> has been <strong>${action}</strong>.</p>
        <div style="background:#f0fdfa;padding:18px;border-radius:14px">
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
        </div>
        <p style="color:#64748b">Please keep this email for your records.</p>
      </div>
    `
  };
}
