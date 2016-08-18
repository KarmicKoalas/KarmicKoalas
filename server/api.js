
const email = require('./email');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/config');
const moment = require('moment');

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
  // req.body.start = 40.8534229,-73.9793236
  // req.body.end = 40.7466059,-73.9885128
  // req.body.waypoints = latlon | latlon | ...NOT USED
  googleApiDirections(req.body.start,req.body.end, (data) => {
    res.send(data);
  });
});

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
    console.log('word',word)
    return db.knex.raw('SELECT `id` FROM `keywords` WHERE `word` = "' + word + '"')
      .then((results) => {
        //console.log('results',results)
        if (results[0][0] === undefined){
          //keyword not in db
          return db.knex.raw('INSERT IGNORE INTO `keywords` (`word`) values ( "' + word + '")')
            .then((result) => {
              var key_id = result[0].insertId
                    //console.log('insert keyword into keywords',word )
                    if(keywords.length === 1){
                      res.status(200).send({message:"We don't have any routes for those keywords"})
                    }
            })
        } else {
          var key_id = results[0][0].id

        //console.log('key_id', key_id)
          //get id for keyword word
        return db.knex.raw('SELECT `route` FROM `keywords_routes` WHERE `key_id` = ' + key_id)
          .then((data) => {
            var routes = []
            //console.log('get routeids from keyword', data[0])
            data[0].forEach((row)=>{
              console.log('row',row)
              console.log('route',row.route)
              routes.push(row.route)
            })
            //this will be a list of records with route ids from join table with keyword id
            routes.forEach((route_id) => {
            //  console.log('route_id', route_id)
              //console.log(routeIdList.includes(route_id))
              if(routeIdList.includes(route_id) === false){
                   routeIdList.push(route_id)
                   count ++;
                   //console.log('routeIdList', routeIdList, count)
                   return db.knex.raw('SELECT `title`,`start`,`end`,`id`,`points_of_interest`,`start_address`, `end_address`  FROM `Routes` WHERE `id` = ' + route_id)
                    .then((routeInfo) => {
                      //console.log('get route_info', routeInfo[0][0])
                      var routeInfo = routeInfo[0][0]
                      var title = routeInfo.title.slice(1,routeInfo.title.length-1)
                      if(routeInfo.start_address !== null){
                        var start_address = routeInfo.start_address.slice(1,routeInfo.start_address.lastIndexOf(',')-6)
                        var end_address = routeInfo.end_address.slice(1,routeInfo.end_address.lastIndexOf(',')-6)
                      } else {
                        var start_address = 'no address available'
                        var end_address = 'no address available'
                      }
                      var data = {
                        title: title,
                        start: routeInfo.start,
                        start_address: start_address,
                        end: routeInfo.end,
                        end_address: end_address,
                        points_of_interest: routeInfo.points_of_interest,
                        id:routeInfo.id
                      }
                      console.log('data',data)
                      routesList.push(data);
                      console.log('routesList',routesList)
                        if (routesList.length === count) {
                          console.log('routeslist',count, routesList)
                           res.status(200).send(routesList)
                        }
                      })
               }
            })
          })
        }
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
  console.log('getMyEventsuserid', user_id)
  //get event_id list from join table using user_id
  return db.knex.raw('SELECT `event_id` FROM `events_participants` WHERE `user_id` = ' + user_id)
    .then((events) => {
      console.log('getMyEvents', events)
      if(events[0].length === 0){
        //no events for this user_id
        res.status(200).send({'message':"You don't have any events"})
      }
       events[0].forEach((item)=>{
       var id = item.event_id
       db.knex.raw('SELECT `Events`.`route_id`,`Events`.`id`, `Events`.`title`, `Events`.`time`, `Events`.`host_id`, `Routes`.`start_address`, `Routes`.`end_address` '+
        'FROM `Events` INNER JOIN `Routes` ON `Routes`.`id`=`Events`.`route_id` WHERE `Events`.`id` = ' + id + '')
           .then((event) => {
             event = event[0][0];
             console.log('getMyEventsevent', event)
            //compile object with data on event]
            if(event.start_address !== null){
              var start_address = event.start_address.slice(1,event.start_address.lastIndexOf(',')-6)
              var end_address = event.end_address.slice(1,event.end_address.lastIndexOf(',')-6)
            } else {
              var start_address = 'no address available'
              var end_address = 'no address available'
            }
            var time = Date.parse(event.time)
            time = moment(time).format("dddd, MMMM Do YYYY, h:mm a");
            obj = {
                route_id:event.route_id,
                start_address:start_address,
                end_address:end_address,
                title: event.title,
                time: time,
                event_id: event.id
              }
              myEvents.push(obj);
              console.log('getMyEvents', myEvents)
              if (myEvents.length === events[0].length) {
                res.status(200).send(myEvents)
              }
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
        // res.status(200).send(JSON.stringify(data))
        res.status(200).send(data);
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
