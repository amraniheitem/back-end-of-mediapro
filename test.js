const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS_APP,
  },
});

const sendTestEmail = async () => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "pluskader@gmail.com", 
    subject: "Test Email",
    text: "plus kader.",
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email de test envoyé avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de test :", error);
  }
};

sendTestEmail();