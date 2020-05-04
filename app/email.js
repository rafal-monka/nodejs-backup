//email

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

exports.sendEmail = (subject, body) => {
    const mailOptions = {
        from: 'monka.rafal@gmail.com',
        to: 'monka.rafal@gmail.com',
        subject: subject,
        text: body
    };
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });    
}