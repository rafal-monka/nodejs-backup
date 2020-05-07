//email
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

exports.sendEmail = (subject, body) => {
console.log('sendEmail');
    const mailOptions = {
        from: 'monka.rafal@gmail.com',
        to: 'monka.rafal@gmail.com',
        subject: subject,
        html: '<!DOCTYPE html>'+
              '<html><head><title>Geoloc Backup Info</title></head>'+
              '<body>'+
              '<h4>'+process.env.DB_HOST+'</h4>'+
              '<pre>'+body+'</pre>'+
              '</body></html>'
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          console.log(error);
      } else {
          console.log('Email sent: ' + info.response);
      }
    });    
}