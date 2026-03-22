const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  // Use Ethereal for demo — fake SMTP that captures emails
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  return transporter;
};

const sendCampaignEmail = async (to, subject, htmlBody) => {
  try {
    const t = await getTransporter();
    const info = await t.sendMail({
      from: '"EngageAI Platform" <noreply@engageai.com>',
      to,
      subject,
      html: htmlBody,
    });
    console.log(`Email sent: ${nodemailer.getTestMessageUrl(info)}`);
    return { success: true, previewUrl: nodemailer.getTestMessageUrl(info) };
  } catch (err) {
    console.error('Email error:', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = { sendCampaignEmail };
