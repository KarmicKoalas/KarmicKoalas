var db = require('../config');

var Route = db.Model.extend({
  tableName: 'routes',
  hasTimestamps: true
});

module.exports = Route;
