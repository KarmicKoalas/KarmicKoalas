var knex = require('knex')({
  client: 'mysql',
  connection: {
    host      : 'mysqlcluster11.registeredsite.com',
    user      : 'adminkoala',
    password  : '!Qaz2wsx3edc',
    database  : 'koala',
    charset   : 'utf8'
  }
});
var bookshelf = require('bookshelf')(knex);
module.exports = {
  bookshelf:bookshelf,
  knex:knex
};


// db.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.schema.createTable('users', function(user) {
//         user.increments('id').primary();
//         user.string('name', 100);
//         user.string('username', 100).unique();
//         user.string('email', 100).unique();
//         user.string('password', 100);
//       })
//       .createTable('keywords', function(keyword) {
//         keyword.increments('id').primary();
//         keyword.string('word', 100);
//       })
//       .createTable('routes', function(route) {
//         route.increments('id').primary();
//         route.string('title', 100);
//         route.json('start', 100);
//         route.json('end', 100);
//         route.json('points_of_interest');
//         route.json('route_object');
//       })
//       .createTable('events', function(event) {
//         event.increments('id').primary();
//         event.string('title', 100);
//         event.varchar('time', 100);
//         event.integer('host_id', 100).references('users.id');
//         event.integer('route_id', 100).references('routes.id');
//         event.blob('participants', 400); //this is a list of userids incuding host
//       });
      // .createTable('events_participants', function(eptable) {
      //   eptable.integer('events_id',11).unsigned().references('id').inTable('events');
      //   eptable.integer('participant',11).unsigned().references('id').inTable('users');
      // })
      // .createTable('keywords_routes', function(table) {
      //   table.integer('route_id',11).unsigned().references('id').inTable('routes');
      //   table.integer('keyword_id',11).unsigned().references('id').inTable('keywords');
      // })
      // .then(function(table) {
      //   table.index('keyword_id');
      // });
//   }
// });
