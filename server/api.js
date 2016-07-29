var express = require('express');
var nodemailer = require('nodemailer');

var app = express();


app.post('/signup', function(req, res){

});

app.post('/login', function(req, res){

});

app.post('/logout', function(req, res){

});

app.post('/createGroup', function(req, res){
  /*
  {
    userId: userId,
    route: route,
    invitees: [email, email]
  }
  */
  console.log(req.body);
  var userId = req.body.userId;
  var user;
  var emails = req.body.emails;
  var transporter = nodemailer.createTransport('smtps://karmickoalas42%40gmail.com:makersquare42@smtp.gmail.com');
  emails.forEach(function(email){
    var mailOptions = {
      to: email,
      subject: 'Hello',
      html: '<b>Hello</b>'
    };
    transporter.sendMail(mailOptions, function(error, info){
      if(error) return console.log(error);
      console.log('Message sent: ' + info.response);
    });
  });
  // db.createGroup(req.body, function(groupId){
  //
  // });

  res.send("ok");
});

app.post('/joinGroup', function(req, res){

});

module.exports = app;
