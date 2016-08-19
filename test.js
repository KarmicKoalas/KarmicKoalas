var User = require('./server/db/models/user');
var Event = require('./server/db/models/event')

new User({id: 70}).fetch({
  withRelated: ["events"]
}).then(user => {
  console.log(user.toJSON());
  var userObject = user.toJSON();
  userObject.events.forEach(e => {
    new Event({id: e.id}).destroy();
  })
})
