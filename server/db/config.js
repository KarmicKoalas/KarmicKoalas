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
      user.string('username', 100).unique();
      user.string('email', 100).unique();
      user.json('routes');
      user.json('groups');
      user.timestamps();
    });
  }
});

db.schema.hasTable('routes').then(function(exists){
  if(!exists){
    return db.schema.createTable('routes', function(route){
      route.increments('id').primary();
      route.string('title', 100);
      route.json('start');
      route.json('end');
      route.json('points_of_interest');
      route.json('keywords');
      route.timestamps();
    });
  }
});

db.schema.hasTable('groups').then(function(exists){
  if(!exists){
    return db.schema.createTable('groups', function(group){
      group.increments('id').primary();
      group.integer('hostId').unsigned().references('users.id');
      group.integer('routeId').unsigned().references('routes.id');
      group.json('invitees');
      group.timestamps();
    });
  }
});


var bookshelf = require('bookshelf')(db);
module.exports = bookshelf;
