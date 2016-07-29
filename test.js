var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://karmickoalas42%40gmail.com:makersquare42@smtp.gmail.com');
// var transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: 'boheepark91@gmail.com',
//     pass: 'pass'
//   }
// });

// setup e-mail data with unicode symbols
var mailOptions = {
    to: 'boheepark91@gmail.com', // list of receivers
    subject: 'Hello World ✔', // Subject line
    html: '<b>Hello world</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});
