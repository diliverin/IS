const nodemailer = require('nodemailer');

// Uses a Gmail account + App Password (NOT your normal Gmail password).
// Set these as environment variables — see .env.example / README.
function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      'Missing EMAIL_USER or EMAIL_PASS environment variables. See README for setup.'
    );
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password, not your login password
    },
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function sendEnquiryEmails({ name, email, phone, enquiryType }) {
  const transporter = getTransporter();
  const fromAddress = process.env.EMAIL_USER;
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

  const safeName = escapeHtml(name);
  const safePhone = escapeHtml(phone);
  const safeType = escapeHtml(enquiryType);

  // 1. Confirmation email to the customer
  const customerMail = transporter.sendMail({
    from: `"India Spice" <${fromAddress}>`,
    to: email,
    subject: 'We received your enquiry — India Spice',
    html: `
      <div style="font-family:sans-serif; max-width:480px; margin:0 auto;">
        <h2 style="color:#2F7A1E;">Thanks, ${safeName}!</h2>
        <p>We've received your ${safeType} enquiry and our team will reach out to you shortly at <strong>${safePhone}</strong> or by replying to this email.</p>
        <p>In the meantime, thank you for your interest in India Spice — Heritage Pantry.</p>
        <p style="color:#777; font-size:12px; margin-top:32px;">This is an automated confirmation. No need to reply unless you'd like to add anything.</p>
      </div>
    `,
  });

  // 2. Full detail email to the site owner / admin
  const adminMail = transporter.sendMail({
    from: `"India Spice Website" <${fromAddress}>`,
    to: adminEmail,
    replyTo: email,
    subject: `New ${safeType} Enquiry — ${safeName}`,
    html: `
      <div style="font-family:sans-serif; max-width:480px; margin:0 auto;">
        <h2>New website enquiry</h2>
        <table style="border-collapse:collapse; width:100%;">
          <tr><td style="padding:6px 0; color:#777;">Name</td><td style="padding:6px 0;"><strong>${safeName}</strong></td></tr>
          <tr><td style="padding:6px 0; color:#777;">Email</td><td style="padding:6px 0;">${escapeHtml(email)}</td></tr>
          <tr><td style="padding:6px 0; color:#777;">Phone</td><td style="padding:6px 0;">${safePhone}</td></tr>
          <tr><td style="padding:6px 0; color:#777;">Type</td><td style="padding:6px 0;">${safeType}</td></tr>
          <tr><td style="padding:6px 0; color:#777;">Submitted</td><td style="padding:6px 0;">${new Date().toLocaleString()}</td></tr>
        </table>
      </div>
    `,
  });

  await Promise.all([customerMail, adminMail]);
}

module.exports = { sendEnquiryEmails };
