'use strict';

const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 8000;
const INDEX = path.join(__dirname, 'index.html');
const app = require('./api');
const server = require('http').Server(app)
 // .use((req, res) => res.sendFile(test) )
server.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = require('socket.io')(server);
var rooms = {};
var userId='foo';

io.on('connection', (socket) => {
  console.log('Client connected');

  this.on('intitialize',(data) =>{
    var myRoom = data.eventId;
    //in future add lookup to db user table to get name from id
    userId = data.userId;
    console.log('intialaze client side', myRoom, userId)
    socket.join('myRoom');
  });
  
  socket.on('location', (data) =>{
    console.log("Incoming location:", data)
    data.title = userId
    io.to('myRoom').emit('groupUpdate', data);
  });

  socket.on('tweet', (data) =>{
    console.log("Incoming tweet:", data)  
    io.to('myRoom').emit('tweet', data);
  });

  socket.on('error', (err)=> {
    console.log("Error", err);
  });

  socket.on('disconnect', () => console.log('Client disconnected'));
});

