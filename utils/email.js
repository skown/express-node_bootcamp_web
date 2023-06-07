const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter - [going to be an object that is able to send mail]
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'a07efb41ebd1c6',
      pass: 'caf1e0d431c88a',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Adrian Skowron <hello@adrian.com>',
    to: options.email,
    subject: options.subject,
    text: options.text,
  };

  // 3) Send email with nodemailer
  // 3) Send mail with defined transporter object
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
