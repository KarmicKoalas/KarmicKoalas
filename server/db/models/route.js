var db = require('../config');

var Route = db.bookshelf.Model.extend({
  tableName: 'Routes'
});

module.exports = Route;
