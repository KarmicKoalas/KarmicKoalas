var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');


var createUser = (body) =>{
    var data = {
        name: body.name,
        username: body.username,
        email: body.email,
        password: body.password
    }
    //data.password = hashPassword(body.password)
    return new User(data).save()
  }

var comparePassword = (attemptedPassword, password, callback)=> {
  bcrypt.compare(attemptedPassword, password, (err, isMatch) =>{
    callback(isMatch);
  });
}
var hashPassword = (password)=>{
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(password, null, null).bind(this)
    .then((hash) => {
      return hash;
    });
}
  module.exports = {
    hashPassword:hashPassword,
    comparePassword:comparePassword,
    createUser:createUser
  }
  //,
  // getUser: (userId, cb)=>{
  //   new User({id: userId}).fetch().then((user)=>{
  //     cb(user);
  //   });
  // },
  // updateUser: (userId, data, cb)=>{
  //   new User({id: userId}).save(data).then((user)=>{
  //     cb(user);
//   //   });
//   // },
//   addEvent: (userId, eventId, cb)=>{
//     new User({id: userId}).fetch().then((user)=>{
//       var events = JSON.parse(user.get('events'));
//       events.push(+eventId);
//       new User({id: userId}).save({events: JSON.stringify(events)}).then((user)=>{
//         cb(user);
//       });
//     });
//   },
//   getEvents: (userId, cb)=>{
//     new User({id: userId}).fetch().then((user)=>{
//       Promise.all(JSON.parse(user.get('events')).map((eventId)=>{
//         return new Event({id: eventId}).fetch()
//       })).then((events)=>{
//         cb(events);
//       });
//     });
//   },
//   addRoute: (userId, routeId, cb)=>{
//     new User({id: userId}).fetch().then((user)=>{
//       var routes = JSON.parse(user.get('routes'));
//       routes.push(+routeId);
//       new User({id: userId}).save({routes: JSON.stringify(routes)}).then((user)=>{
//         cb(user);
//       });
//     });
//   },
//   getRoutes: (id, cb)=>{
//     new User({id: id}).fetch().then((user)=>{
//       Promise.all(JSON.parse(user.get('routes')).map((eventId)=>{
//         return new Route({id: routeId}).fetch()
//       })).then((routes)=>{
//         cb(routes);
//       })
//     })
//   }
// };
