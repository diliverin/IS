const { sendEnquiryEmails } = require('../lib/mailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { name, email, phone, enquiryType } = req.body || {};

  if (!name || !email || !phone || !enquiryType) {
    res.status(400).json({ error: 'All fields are required.' });
    return;
  }
  if (!['B2B', 'B2C'].includes(enquiryType)) {
    res.status(400).json({ error: 'Invalid enquiry type.' });
    return;
  }

  try {
    await sendEnquiryEmails({ name, email, phone, enquiryType });
    console.log('Enquiry emailed:', { name, email, phone, enquiryType });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Failed to send enquiry emails:', err.message);
    res.status(500).json({ error: 'Could not send your enquiry right now. Please try again.' });
  }
};
