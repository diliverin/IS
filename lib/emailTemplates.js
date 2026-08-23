// Table-based HTML email templates with inline styles — this layout style
// (not flexbox/grid, not external stylesheets) is what reliably renders
// correctly across Gmail, Outlook, Apple Mail, etc.

const GREEN = '#2F7A1E';
const GREEN_DARK = '#1E5713';
const GREEN_TINT = '#EEF6EA';
const INK = '#14140F';
const INK_SOFT = '#5B5B54';
const LINE = '#E7E7E0';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Shared shell: green header with logo, white content area, footer.
function emailShell({ preheader, bodyHtml }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>India Spice</title>
</head>
<body style="margin:0; padding:0; background-color:#F4F4F1; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
  <!-- Preheader (hidden preview text) -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${escapeHtml(preheader)}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F4F1; padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#FFFFFF; border-radius:20px; overflow:hidden; border:1px solid ${LINE};">

          <!-- Header -->
          <tr>
            <td style="background-color:${GREEN}; padding:28px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:40px; height:40px; background-color:#FFFFFF; border-radius:50%; text-align:center; vertical-align:middle; font-weight:bold; font-size:15px; color:${GREEN}; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
                    IS
                  </td>
                  <td style="padding-left:12px; color:#FFFFFF; font-size:18px; font-weight:bold; letter-spacing:0.03em; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
                    INDIA SPICE
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px; background-color:${GREEN_TINT}; border-top:1px solid ${LINE};">
              <p style="margin:0; font-size:12px; color:${INK_SOFT}; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
                © ${new Date().getFullYear()} India Spice Heritage Pantry. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function customerConfirmationTemplate({ name, phone, enquiryType }) {
  const safeName = escapeHtml(name);
  const safePhone = escapeHtml(phone);
  const safeType = escapeHtml(enquiryType);

  const bodyHtml = `
    <p style="margin:0 0 6px; font-size:12px; font-weight:bold; letter-spacing:0.15em; color:${GREEN}; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
      CURATED DISCOVERY
    </p>
    <h1 style="margin:0 0 18px; font-size:26px; color:${INK}; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
      Thanks, ${safeName}!
    </h1>
    <p style="margin:0 0 16px; font-size:15px; line-height:1.7; color:${INK_SOFT}; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
      We've received your <strong style="color:${INK};">${safeType}</strong> enquiry and our team will reach out shortly at <strong style="color:${INK};">${safePhone}</strong>, or you can simply reply to this email.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${GREEN_TINT}; border-radius:14px; margin:24px 0;">
      <tr>
        <td style="padding:18px 20px; font-size:14px; color:${INK}; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
          🌿 &nbsp;Fresh, heritage spices are on their way. We'll be in touch before launch.
        </td>
      </tr>
    </table>

    <p style="margin:0; font-size:13px; color:${INK_SOFT}; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
      In the meantime, thank you for your interest in India Spice — Heritage Pantry.
    </p>
  `;

  return emailShell({
    preheader: `Thanks ${name} — we received your ${enquiryType} enquiry.`,
    bodyHtml,
  });
}

function adminNotificationTemplate({ name, email, phone, enquiryType }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeType = escapeHtml(enquiryType);
  const submittedAt = new Date().toLocaleString();

  const row = (label, value) => `
    <tr>
      <td style="padding:12px 0; border-bottom:1px solid ${LINE}; font-size:12px; font-weight:bold; letter-spacing:0.05em; color:${INK_SOFT}; font-family:'Segoe UI', Helvetica, Arial, sans-serif; width:120px; vertical-align:top;">
        ${label}
      </td>
      <td style="padding:12px 0; border-bottom:1px solid ${LINE}; font-size:15px; color:${INK}; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
        ${value}
      </td>
    </tr>
  `;

  const bodyHtml = `
    <p style="margin:0 0 6px; font-size:12px; font-weight:bold; letter-spacing:0.15em; color:${GREEN}; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
      NEW ENQUIRY
    </p>
    <h1 style="margin:0 0 6px; font-size:24px; color:${INK}; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
      ${safeName}
    </h1>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:22px;">
      <tr>
        <td style="background-color:${GREEN_TINT}; color:${GREEN_DARK}; font-size:11px; font-weight:bold; letter-spacing:0.08em; padding:6px 14px; border-radius:999px; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
          ${safeType} ENQUIRY
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row('NAME', safeName)}
      ${row('EMAIL', `<a href="mailto:${safeEmail}" style="color:${GREEN}; text-decoration:none;">${safeEmail}</a>`)}
      ${row('PHONE', `<a href="tel:${safePhone}" style="color:${GREEN}; text-decoration:none;">${safePhone}</a>`)}
      ${row('TYPE', safeType)}
      ${row('SUBMITTED', submittedAt)}
    </table>

    <p style="margin:24px 0 0; font-size:13px; color:${INK_SOFT}; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
      Reply directly to this email to respond to ${safeName}.
    </p>
  `;

  return emailShell({
    preheader: `New ${enquiryType} enquiry from ${name}`,
    bodyHtml,
  });
}

module.exports = {
  escapeHtml,
  customerConfirmationTemplate,
  adminNotificationTemplate,
};
