var User = require('../models/user.js');

module.exports = {
  createUser: (data, cb) =>{
    new User(data).save().then((user)=>{
      cb(user);
    });
  },
  getUser: (userId, cb)=>{
    User.where({id: userId})
    .fetch()
    .then((user)=>{
      cb(user);
    });
  },
  // not tested
  updateUser: (userId, data, cb)=>{
    new User({id: userId}).save(data).then((user)=>{
      cb(user);
    });
  },
  getEvents: (id, cb)=>{
    new User({id: id}).fetch().then((user)=>{
      Promise.all(JSON.parse(user.get('events')).map((groupId)=>{
        return new Group({id: groupId}).fetch()
      })).then((groups)=>{
        cb(groups);
      });
    });
  },
  getRoutes: (id, cb)=>{
    new User({id: id}).fetch().then((user)=>{
      Promise.all(JSON.parse(user.get('routes')).map((groupId)=>{
        return new Route({id: routeId}).fetch()
      })).then((routes)=>{
        cb(routes);
      })
    })
  }
};
