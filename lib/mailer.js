const nodemailer = require('nodemailer');
const {
  customerConfirmationTemplate,
  adminNotificationTemplate,
} = require('./emailTemplates');

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

async function sendEnquiryEmails({ name, email, phone, enquiryType }) {
  const transporter = getTransporter();
  const fromAddress = process.env.EMAIL_USER;
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

  // 1. Branded confirmation email to the customer
  const customerMail = transporter.sendMail({
    from: `"India Spice" <${fromAddress}>`,
    to: email,
    subject: 'We received your enquiry — India Spice',
    html: customerConfirmationTemplate({ name, phone, enquiryType }),
  });

  // 2. Branded lead-detail email to the site owner / admin
  const adminMail = transporter.sendMail({
    from: `"India Spice Website" <${fromAddress}>`,
    to: adminEmail,
    replyTo: email,
    subject: `New ${enquiryType} Enquiry — ${name}`,
    html: adminNotificationTemplate({ name, email, phone, enquiryType }),
  });

  await Promise.all([customerMail, adminMail]);
}

module.exports = { sendEnquiryEmails };
