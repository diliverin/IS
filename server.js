require('dotenv').config();
const express = require('express');
const path = require('path');
const { sendEnquiryEmails } = require('./lib/mailer');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

app.use(express.json());
app.use(express.static(PUBLIC_DIR));

// Enquiry form submissions
app.post('/api/enquiry', async (req, res) => {
  const { name, email, phone, enquiryType } = req.body || {};

  if (!name || !email || !phone || !enquiryType) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (!['B2B', 'B2C'].includes(enquiryType)) {
    return res.status(400).json({ error: 'Invalid enquiry type.' });
  }

  try {
    await sendEnquiryEmails({ name, email, phone, enquiryType });
    console.log('Enquiry emailed:', { name, email, phone, enquiryType });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Failed to send enquiry emails:', err.message);
    res.status(500).json({ error: 'Could not send your enquiry right now. Please try again.' });
  }
});

// 404 handler — must be last
app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html'));
});

app.listen(PORT, () => {
  console.log(`India Spice site running at http://localhost:${PORT}`);
});
