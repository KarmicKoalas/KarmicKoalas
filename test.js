var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://karmickoalas42%40gmail.com:makersquare42@smtp.gmail.com');

// setup e-mail data with unicode symbols
var mailOptions = {
    to: 'boheepark91@gmail.com, boheepark21@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world 🐴', // plaintext body
    html: '<b>Hello world 🐴</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});









// var nodemailer = require('nodemailer');
// var transporter = nodemailer.createTransport('smptps://karmickoalas42%40gmail.com:makersquare42@smptp.gmail.com');
// var user_email = "boheepark91@gmail.com";
// var options = {
//   to: user_email,
//   subject: 'WeGoToo Invitation',
//   html: '<b>WeGoToo!!</b><p>You have a new event. Open the app to check it out!</p>'
// }
// transporter.sendMail(options, (err, data) => {
//   if(err) return console.error(err);
//   console.log("Message sent:", data.response);
// });
