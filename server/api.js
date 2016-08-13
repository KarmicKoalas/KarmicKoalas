
const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/config')

const User = require('./db/models/user');
const Keyword = require('./db/models/keyword');
const Route = require('./db/models/route');
const Event = require('./db/models/event');

const userController = require('./db/controllers/userController');
const routeController = require('./db/controllers/routeController');
const eventController = require('./db/controllers/eventController');
const mysql = require('mysql');
const googleApiDirections = require('./googleApiDirections');
const app = express();

app.use(bodyParser.json());

app.post('/getRouteFromGoogle', (req, res) => {
  // req.body.start = 40.8534229,-73.9793236
  // req.body.end = 40.7466059,-73.9885128
  // req.body.waypoints = latlon | latlon | ...NOT USED
  googleApiDirections(req.body.start, req.body.end, (data) => {
    res.send(data);
  });
});

app.post('/getAddressFromLoc', (req,res) => {
  // req.body.loc = 40.8534229,-73.9793236

});

app.post('/getRouteById', (req, res) => {
  var event_id = req.body.event_id;
  return  db.knex.raw('SELECT `route_id` FROM `Events` WHERE `id` = ' + event_id )
    .then((route_id) => {
      route_id = route_id[0][0].route_id;
      return  db.knex.raw('SELECT * FROM `Routes` WHERE `id` = ' + route_id )
        .then((routeObject) => {
          routeObject = routeObject[0][0]
          var data =  {title:routeObject.title, start:routeObject.start, end:routeObject.end, points_of_interest:routeObject.points_of_interest, route_object:routeObject.route_object}
          res.status(200).send(data)
    })
  })
});

app.post('/getMyEvents', (req, res) => {
  var myEvents = []
  //returns all events for a user.. should filter for time < current Time
  // returns [ { event_id : {title, time}},{ event_id : {title, time}}….]
  var user_id = req.body.user_id;
  return  db.knex.raw('SELECT `event_id` FROM `events_participants` WHERE `user_id` = ' + user_id )
       .then((events) => {
          events[0].forEach((item) => {
            item = item.event_id
            return  db.knex.raw('SELECT * FROM `Events` WHERE `id` = ' + item )
              .then((event) => {
                event = event[0][0];
                 var obj = {title:event.title,time:event.time,event_id:event.id}
                //  return  db.knex.raw('SELECT `start` FROM `Routes` WHERE `id` = ' + event[0].route_id )
                //     .then((route) => {
                //         console.log('route',route)
                //       obj.start = route[0].start;
                //       obj.end = route[0].end;
                //     })
                  //  console.log(obj)
                 myEvents.push(obj);
                 if(myEvents.length === events[0].length){
                   res.status(200).send(myEvents)
                 }
              })
          })
      })
    });

app.get('/getAllUsers', (req, res) => {
  var allUsers = []
  // returns [ { name : name,user_id: user_id},{ name : name,user_id: user_id}….]
  return  db.knex.raw('SELECT `name`, `id` FROM `Users`')
    .then((results) => {
          results[0].forEach((item) => {
            var obj = {name:item.name, user_id:item.id}
            allUsers.push(obj);
          })
       res.status(200).send(results)
    })
})

app.post('/signup', (req, res) => {
  //check if existing user..
  //req.body  = {username, email, password}
  //reurn userID from db
  new User({
      name: req.body.name
    }).fetch()
    .then((user) => {
      if (!user) {
        //add new user
        userController.createUser(req.body)
          .then((user) => {
            var data = {
              'userId': user['id']
            };
            res.status(200).send(data)
          });
      } else {
        //  existing user
        var newPassword = req.body.password
          // userController.comparePassword(user.password, newPassword, (matches) => {
          //         if (matches) {
          //             //log in
        var data = {
          'userId': user['id']
        };
        res.status(200).send(JSON.stringify(data))
          // } else {
          //     //send resp with error, wrong password
          //     res.send(401, 'wrong password!')
          // }
          //})
      }
    })
});

app.post('/createRoute', (req, res) => {
  // {title:string, keywords:[],start:{}, end:{}, routeObject:[]}
  //{title:'bike in Central Park', keywords:['New York', 'Central Park', 'bike', 'bicycle'],start:'{latitude: 37.33756603, longitude: -122.02681114}', end:{latitude: 37.34756603, longitude: -122.02581114}, routeObject: '[{latitude: 37.33756603, longitude: -122.02681114}, {latitude: 37.34756603, longitude: -122.02581114}]'}
  var keywordIdList = [];
  var route_id;
  //var body = JSON.parse(req.body);
  var keywords = req.body.keywords
    //var addWords = helpers.generateKeywords(req.body)
    //keywords: req.body.keywords
    //"{title:'foo',start:{'lat:lon'},end:{lat:lon},keywords:'[key,key]',routeObject:'{sdfasf}''}"
    //on insert to routes, .get() route_id. on insert to keywords,
    // .get() each keword_id and insert pairs into this join table
    //add route object to route table
  routeController.createRoute(req.body)
    .then((input) => {
      route_id = input.id
      console.log('input', route_id)
        //add each keyword to keywords table if new, else get id
      keywords.forEach((input) => {
        // new Keyword({word:input}).fetch()
        //  knex.raw('INSERT INTO table (Keywords) values (?) ON DUPLICATE KEY UPDATE c=c+1', [1, 2, 3]);
        // .then ((result) => {
        //  if (result !== null){
        //    //existing keyword. get the keyword_id
        //    keyword_id = result['id']
        //    keywordIdList.push(keyword_id)
        //    console.log('existing keyword',keywordIdList)
        //
        //  } else if (!result){
        // console.log('new keyword')
        //new keyword.. make a new entry and get id
        //add keyword_id to join table with route_id
        new Keyword({
            word: input
          }).save()
          .then((keyword) => {
            keyword_id = keyword['id']
              //add to join table
            return db.knex.raw('INSERT INTO `keywords_routes` (`keyword_id`, `route_id`) values (' + keyword_id + ', ' + route_id + ' ) ')
               .then((result)=>{
                 //console.log('INSERT INTO `keywords_routes', result)
               })
          })
      })
      console.log('route_id', route_id)
      res.status(200).send(JSON.stringify({
          'route_id': route_id
        }))
    })
})
//.then(()=>{
//     //add keyword_id to join table with route_id
//     console.log('route_id',route_id)
//     console.log('keywordIdList',keywordIdList)
//     keywordIdList.forEach((input) => {
//        var data = {
//           keyword_id: input,
//           route_id: route_id,
//         }
//           console.log('data',data)
//       new keyword_route(data).save()
//          .then((resp)=>{
//         console.log('db updated')
//       });
   //})
//})
app.post('/createEvent', (req, res) => {
  //{title:string, host:user_id, guests:[user_id, user_id], route_id, route_id, time:time}
  //return all events for host
  var event_id;
  var participants = req.body.guests;
  participants.push(req.body.host)
  var data = req.body;
  return db.knex.raw('INSERT INTO `Events` (`title`, `host_id`, `route_id`, `time`) VALUES ("'+ data.title + '",' + data.host + ',' + data.route_id + ',"' + data.time + '")')
    .then((event) =>{
        event_id = event[0].insertId;
    })
    .then(()=>{
        participants.forEach((user_id)=>{
           return db.knex.raw('INSERT INTO `events_participants` (`event_id`, `user_id`) VALUES (' + event_id + ', ' + user_id + ' )')
             .then((result)=>{
             })
          })
      })
    .then(()=>{
    res.status(200).send('ok')
 })
  //  var transporter = nodemailer.createTransport('smptps://karmickoalas42%40gmail.com:makersquare42@smptp.gmail.com');
  // JSON.parse(event.get('invitees')).forEach((invitee) => {
  //     var options = {
  //         to: invitee,
  //         subject: 'Karmic Koalas',
  //         html: '<b>Karmic Koalas</b>'
  //     };
  //     transporter.sendMail(options, (err, data) => {
  //         if (err) return console.error(err);
  //         console.log("Message sent:", data.response);
  //     });
  // });

});


app.post('/joinEvent', (req, res) => {

});

app.post('/getEvents', (req, res) => {
  userController.getEvents(req.body.id, (events) => {
    res.send(events);
  });
});


module.exports = app;
