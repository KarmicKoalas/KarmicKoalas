var express = require('express');
var fs = require('fs');
var path = require('path');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var nodemailer = require('nodemailer');

var app = express();



// for development
app.use(morgan('dev'));
app.use(cookieParser()); // to read cookies
app.use(bodyParser()); // read forms

// set a normalized path to public.
var rootPath = path.normalize(__dirname + '/../public');

app.use('/node_modules', express.static(__dirname + './node_modules/'));

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

var port = process.env.PORT || 8000;
app.listen(port);
console.log("port:", port);
