const nodeMailer = require("nodemailer");

module.exports = async function ({ email, subject, message }) {
    console.log(process.env.SMTP_MAIL);
    console.log(process.env.SMTP_PASSWORD);

    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        service: process.env.SMTP_MAIL_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    })

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: subject,
        text: message
    }

    // now we send the mail
    await transporter.sendMail(mailOptions);
}