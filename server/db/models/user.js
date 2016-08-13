var db = require('../config');

var User = db.bookshelf.Model.extend({
  tableName: 'Users'
});


module.exports = User;
