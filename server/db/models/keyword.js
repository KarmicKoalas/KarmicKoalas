var db = require('../config');
var Route = require('./route');

var Keyword = db.bookshelf.Model.extend({
  tableName: 'keywords',
     routes: ()=> {
     return this.belongsToMany(Route);
   }
});

module.exports = Keyword;
