const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1- create transporter "service that sends email [gmail, mailgun, mailtrap, sendGrid, etc ..]"
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT, // if secure true 465 else 487
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    // 2- define email options "from - to - subject - content"
    const mailOptions = {
        from: `ASME CUSB <${process.env.EMAIL_USERNAME}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    // 3- send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;