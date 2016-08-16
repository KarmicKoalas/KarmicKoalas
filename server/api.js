
const email = require('./email');
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
const googleApiAddresses = require('./googleApiAddresses');
const app = express();

app.use(bodyParser.json());

app.post('/getRouteFromGoogle', (req, res) => {
  console.log(req.body)

  // req.body.start = 40.8534229,-73.9793236
  // req.body.end = 40.7466059,-73.9885128
  // req.body.waypoints = latlon | latlon | ...NOT USED
  googleApiDirections(req.body.start,req.body.end, (data) => {
    res.send(data);
  });
});

// app.post('/getAddressFromGoogle', (req, res, cb) => {
//   //{"start":"0.8534229,-73.9793236","end":"40.7466059,-73.9885128"}
//   googleApiAddresses(req.body, (address) => {
//     cb(address);
//   });
// });

app.post('/searchKeywords', (req, res) => {
  var routeIdList = [];
  var routes = [];
  var routesList = [];
  var count = 0;
  //returns matching routes,[ {id, title, start, end, points_of_interest},...]
  var keywords = req.body.keywords;
  console.log('keywords',keywords)
  //get id for each keyword from keywords db
  keywords.forEach((word) => {
    return db.knex.raw('SELECT `id` FROM `keywords` WHERE `word` = "' + word + '"')
      .then((result) => {
        if (result[0][0] === undefined){
          //keyword not in db
          return db.knex.raw('INSERT IGNORE INTO `keywords` (`word`) values ( "' + word + '")')
            .then((result) => {
              var key_id = result[0].insertId
                    console.log('insert keyword into keywords',word )
            })
        } else {
          var key_id = result[0][0].id
        }
        console.log('key_id', key_id)
          //get id for keyword word
        return db.knex.raw('SELECT `route` FROM `keywords_routes` WHERE `key_id` = ' + key_id)
          .then((data) => {
            //console.log('get routeids from keyword', data[0][0].route)
            routes.push(data[0][0].route)
            //this will be a list of records with route ids from join table with keyword id
            routes.forEach((route_id) => {
              console.log('route_id', route_id)
              //console.log(routeIdList.includes(route_id))
              if(routeIdList.includes(route_id) === false){
                   routeIdList.push(route_id)
                   count ++;
                   console.log('routeIdList', routeIdList, count)
                   return db.knex.raw('SELECT `title`,`start`,`end`,`id`,`points_of_interest`,`start_address`, `end_address`  FROM `Routes` WHERE `id` = ' + route_id)
                    .then((routeInfo) => {
                      console.log('get route_info', routeInfo[0][0])
                      var routeInfo = routeInfo[0][0]
                      var data = {
                        title: routeInfo.title,
                        start: routeInfo.start,
                        start_address: routeInfo.start_address,
                        end: routeInfo.end,
                        end_address: routeInfo.end_address,
                        points_of_interest: routeInfo.points_of_interest,
                        id:routeInfo.id
                      }
                      console.log(data)
                      routesList.push(data);
                      console.log('routesList',routesList)
                        if (routesList.length === count) {
                           res.status(200).send(routesList)
                        }
                      })
               }
            })
          })
  })
 })
});
app.post('/getRouteById', (req, res) => {
  var event_id = req.body.event_id;
  console.log('getRouteByID', event_id)
  //get id for route from events db based on event_id from client
  return db.knex.raw('SELECT `route_id` FROM `Events` WHERE `id` = ' + event_id)
    .then((route_id) => {
      route_id = route_id[0][0].route_id;
      console.log('getRouteByID', route_id)
      //use route_id from Events table to get Route data from Routes table
      return db.knex.raw('SELECT * FROM `Routes` WHERE `id` = ' + route_id)
        .then((routeObject) => {
          routeObject = routeObject[0][0]
          //compile route data to show route and return to client
          var data = {
            title: routeObject.title,
            start: routeObject.start,
            end: routeObject.end,
            points_of_interest: routeObject.points_of_interest,
            route_object: routeObject.route_object
          }
          console.log('getRouteByID', data)
          res.status(200).send(data)
        })
    })
});

app.post('/getMyEvents', (req, res) => {
  var myEvents = [], obj;
    //returns all events for a user.. should filter for time < current Time
    // returns [ { event_id : {title, time, startAddres, endAddress}},{ event_id : {title, time, startAddres, endAddress}}….]
  var user_id = req.body.user_id;
  //get user_id from client
  console.log('getMyEvents', user_id)
  //get event_id list from join table using user_id
  return db.knex.raw('SELECT `event_id` FROM `events_participants` WHERE `user_id` = ' + user_id)
    .then((events) => {
      console.log('getMyEvents', events)
      events[0].forEach((item) => {
        //for each event_id get the event info from Events table
        item = item.event_id
        return db.knex.raw('SELECT * FROM `Events` WHERE `id` = ' + item)
          .then((event) => {
            event = event[0][0];
            console.log('getMyEvents', event)
            //compile object with data on event
            obj = {
                title: event.title,
                time: event.time,
                event_id: event.id
              }
              //console.log('obj', obj)
             return  db.knex.raw('SELECT `start_address`, `end_address` FROM `Routes` WHERE `id` = ' + event.route_id )
            .then((route) => {
              //  console.log('route',route[0][0])
              obj.start_address = route[0][0].start_address;
              obj.end_address = route[0][0].end_address;
              //console.log('moreobj', obj)
              myEvents.push(obj);
              console.log('getMyEvents', myEvents)
              if (myEvents.length === events[0].length) {
                res.status(200).send(myEvents)
              }
            })
            //console.log(obj)

          })
      })
    })
});

app.get('/getAllUsers', (req, res) => {
  var allUsers = []
    // returns [ { name : name,user_id: user_id},{ name : name,user_id: user_id}….]
  return db.knex.raw('SELECT `name`, `id` FROM `Users`')
    .then((results) => {
      results[0].forEach((item) => {
        var obj = {
          name: item.name,
          user_id: item.id
        }
        allUsers.push(obj);
      })
      res.status(200).send(allUsers)
    })
});

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
  //{title:'bike in Central Park', keywords:['New York', 'Central Park', 'bike', 'bicycle'],start:'{latitude: 37.33756603, longitude: -122.02681114}', end:{latitude: 37.34756603, longitude: -122.02581114}, routeObject: '[{latitude: 37.33756603, longitude: -122.02681114}, {latitude: 37.34756603, longitude: -122.02581114}]'}
  var route_id;
  var count = 0;
  var keywords = req.body.keywords
        console.log('insert keyword into routes',keywords )
    //var addWords = helpers.generateKeywords(req.body)
    googleApiAddresses(req.body.start, req.body.end, (address) => {
    console.log(address);
    var data = req.body;
    data.startAddress = address.start
    data.endAddress = address.end
    //add route object to route table
  routeController.createRoute(req.body)
    .then((input) => {
      route_id = input.id
        //add each keyword to keywords table if new, else get id
      keywords.forEach((input) => {
        return db.knex.raw('INSERT IGNORE INTO `keywords` (`word`) values ( "' + input + '")')
          .then((result) => {
            keyword_id = result[0].insertId
                  console.log('insert keyword into routes',input )
          })
          .then(() => {
            if (keyword_id === 0) {
              //existing keyword, get id with select
              return db.knex.raw('SELECT * FROM `keywords` WHERE `word` = "' + input + '"')
                .then((result) => {
                  keyword_id = result[0][0].id
                        console.log('insert keyword into routes',keyword_id )
                })
            }
          })
          .then(() => {
            return db.knex.raw('INSERT INTO `keywords_routes` (`key_id`, `route`) values (' + keyword_id + ', ' + route_id + ' ) ')
              .then((result) => {
                ++count;
                  console.log('insert keyword into keyword_routes',keyword_id )
                if (count === keywords.length) {
                  res.status(200).send(JSON.stringify({
                    'route_id': route_id
                  }))
                }
              })
          })
      })
    })
  })
});

app.post('/createEvent', (req, res) => {
  //{title:string, host:user_id, guests:[user_id, user_id], route_id, route_id, time:time}
  //return all events for host
  var event_id;
  var participants = req.body.guests;
  participants.push(req.body.host)
  var data = req.body;
  console.log('createEvent',data )
  return db.knex.raw('INSERT INTO `Events` (`title`, `host_id`, `route_id`, `time`) VALUES ("' + data.title + '",' + data.host + ',' + data.route_id + ',"' + data.time + '")')
    .then((event) => {
      event_id = event[0].insertId;
    })
    .then(() => {
      var insertData = '';
      var idlist = '(';
      participants.forEach((user_id) => {
        insertData += '(' + event_id + ', ' + user_id + ' ), '
        idlist += user_id + ', ';
      })
      idlist = idlist.slice(0,-2)
      idlist = idlist += ')';
      insertData = insertData.slice(0, -2)
      insertData += ';'
      return db.knex.raw('INSERT INTO `events_participants` (`event_id`, `user_id`) VALUES ' + insertData  )
      .then((result) => {
         return db.knex.raw('SELECT `email` FROM `Users` WHERE `id` IN ' + idlist)
         .then((emails) => {
           //compile list of emails in format for nodemailer
           var user_emails = '';
           emails[0].forEach((email) =>{
             console.log(email.email)
             user_emails += email.email + ', '
           })
           user_emails.slice(0,-2)
           var message = '<b>WeGoToo!!</b><p>You have a new event. Open the app to check it out!</p>'
           email.sendMail(user_emails, message);
         })
        })
     })
    .then(() => {
      res.status(200).send(JSON.stringify({
        'create_event': 'ok'
      }))
    })
});

module.exports = app;
