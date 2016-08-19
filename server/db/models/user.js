var db = require('../config');
var Event = require('./event');

var User = db.bookshelf.Model.extend({
  tableName: 'Users',
  events: function(){
    return this.hasMany(Event, "host_id");
  }
});


module.exports = User;
