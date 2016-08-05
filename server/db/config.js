var db = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'karmic'
  }
});

db.schema.hasTable('users').then(function(exists){
  if(!exists){
    return db.schema.createTable('users', function(user){
      user.increments('id').primary();
      user.string('name', 100);
      user.string('username', 100).unique();
      user.string('email', 100).unique();
      user.json('routes');
      user.json('events');
      user.timestamps();
    });
  }
});

db.schema.hasTable('keywords').then((exists)=>{
  if(!exists){
    return db.schema.createTable('keywords', (keyword)=>{
      keyword.increments('id').primary();
      keyword.string('word', 100);
      keyword.timestamps();
    });
  }
});

db.schema.hasTable('routes').then((exists)=>{
  if(!exists){
    return db.schema.createTable('routes', (route)=>{
      route.increments('id').primary();
      route.string('title', 100);
      route.json('start',100);
      route.json('end',100);
      route.json('points_of_interest');
      route.json('route');
      route.timestamps();
    });
  }
});
//use this table for keyword search
//add to this table each time you add a route.
//on insert to routes, .get() route_id. on insert to keywords,
// .get() each keword_id and insert pairs into this join table
// db.schema.hasTable('keyword_routes').then((exists)=>{
//   if(!exists){
//   return db.schema.createTable('keyword_routes', (table)=>{
//     table.integer('routes_id').references('routes.id');
//     table.integer('keywords_id').references('keywords.id');
//   });
//  }
// });


db.schema.hasTable('events').then((exists)=>{
  if(!exists){
    return db.schema.createTable('events', (event)=>{
      event.increments('id').primary();
      event.string('name',100);
      event.integer('hostId',100).unsigned().references('users.id');
      event.integer('routeId',100).unsigned().references('routes.id');
      event.json('invitees',400); //this is a list of contacts from user phonebook
      event.timestamps();
    });
  }
});

//use this table to generate room access permissions for sockets in server.js
//add to this table when invite accepted and add host on event creation 
db.schema.hasTable('event_participant').then((exists)=>{
  if(!exists){
  return db.schema.createTable('event_participant', (table)=>{
    table.integer('events_id').references('events.id');
    table.integer('participant').references('users.id');
  });
 }
});
var bookshelf = require('bookshelf')(db);
module.exports = bookshelf;
