var nodemailer = require('nodemailer');
function sendMail(user_email, message){
// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://karmickoalas42%40gmail.com:makersquare42@smtp.gmail.com');

// setup e-mail data with unicode symbols
var mailOptions = {
    to: user_email, // list of receivers
    subject: 'WeGoToo Invitation', // Subject line
    html: message

};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});
}

module.exports ={sendMail:sendMail}
