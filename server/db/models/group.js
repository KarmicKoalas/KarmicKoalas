var db = require('../config');

var Group = db.Model.extend({
  tableName: 'groups',
  hasTimestamps: true
});

module.exports = Group;
