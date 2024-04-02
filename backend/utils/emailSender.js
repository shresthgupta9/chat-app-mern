const nodemailer = require("nodemailer");

const Transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendMail({ from, to, subject, text }) {
    try {
        const mailOptions = { from, to, subject, text };
        return await Transporter.sendMail(mailOptions);
    } catch (err) {
        console.log(err);
    }
}

module.exports = sendMail;
