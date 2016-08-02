var nodemailer = require('nodemailer');
var express = require('express');
var bodyParser = require('body-parser');

var User = require('./db/models/user.js');
var Group = require('./db/models/group.js');
var Route = require('./db/models/route.js');

var app = express();

app.use(bodyParser.json());


app.post('/signup', function(req, res){
  new User({
    username: req.body.username,
    email: req.body.email,
    routes: req.body.routes,
    groups: req.body.groups
  })
  .save()
  .then(function(user){
    // res.send(JSON.stringify(user));
    res.send(user);
  });
});

app.post('/login', function(req, res){

});

app.post('/logout', function(req, res){

});

app.post('/createRoute', function(req, res){
  new Route({
    title: req.body.title,
    start: req.body.start,
    end: req.body.end,
    points_of_interest: req.body.points_of_interest,
    keywords: req.body.keywords
  })
  .save()
  .then(function(route){
    res.send('ok');
  });
});

app.post('/createGroup', function(req, res){
  new Group({
    host: req.body.userId,
    route: req.body.routeId,
    invitees: req.body.invitees
  })
  .save()
  .then(function(group){
    var transporter = nodemailer.createTransport('smtps://karmickoalas42%40gmail.com:makersquare42@smtp.gmail.com');
    JSON.parse(group.get('invitees')).forEach(function(email){
      var mailOptions = {
        to: email,
        subject: 'Karmic Koalas',
        html: '<b>Karmic Koalas</b>'
      };
      transporter.sendMail(mailOptions, function(err, data){
        if(err) return console.error(err);
        console.log("Message sent:", data.response);
      });
    });
  });

  res.send("ok");
});

app.post('/joinGroup', function(req, res){

});

app.post('/groups', function(req, res){
  new User({
    id: req.body.userId
  })
  .fetch()
  .then(function(user){
    Promise.all(JSON.parse(user.get('groups')).map(function(groupId){
      return new Group({
        id: groupId
      }).fetch()
    }))
    .then(function(groups){
      res.send(groups);
    });
  });
});

module.exports = app;
