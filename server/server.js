'use strict';

const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 8000;
const INDEX = path.join(__dirname, 'index.html');
const app = require('./api');
const server = require('http').Server(app)
    app.use((req, res) => res.sendFile(INDEX) )
server.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = require('socket.io')(server);
var rooms = {};
var userId;
var username;
var myRoom;

const db = require('./db/config');

var joinRoom = (data, socket) => {
//  var myRoom = data.eventId;
  //check to see if user_id is matched with event_id in
  //events_participants join table
  return db.knex.raw('SELECT * FROM `events_participants` WHERE `event_id`=' + data.event_id + ' AND `user_id`= ' + data.user_id)
       .then((results) =>{
         results = results[0][0]
         if (results.length === 0){
           //not a participant in this event
         } else {
            if(rooms.myRoom){
              //existing room
              rooms.myRoom.push(socket)
            } else {
              rooms.myRoom = [];
              rooms.myRoom.push(socket)
            }
        }
       return;
  })
}
io.on('connection', (socket) => {
            console.log('Client connected');

            socket.on('intitialize', (data) => {
                myRoom = data.eventId;
                userId = data.userId;
                username = data.username;
                joinRoom(myRoom, socket)
                console.log('intialaze client side', data)
                socket.join(myRoom);
            });
  
            socket.on('location', (data) => {
                console.log("Incoming location with updated title:", data)
                console.log("Incoming location:", data)
                data.title = username
                io.to(myRoom).emit('groupUpdate', data);
            });

            socket.on('tweet', (data) => {
                console.log("Incoming tweet:", data)
                io.to(myRoom).emit('tweet', data);
            });

            socket.on('error', (err) => {
                console.log("Error", err);
            });

            socket.on('disconnect', () => console.log('Client disconnected'));

 });
