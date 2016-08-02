'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(test) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

//const api = require('./api')
const io = socketIO(server);
//var group = [];
var rooms = {};

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.join('testGroup')
  
  socket.on('intitialize', (data) =>{
    console.log('initialize',data.groupId)
     socket.join(data.groupId)
     rooms.socket = data.groupId
  })

  socket.on('location', (data) => {
     console.log("Incoming location:", data)
     var arr = []
     arr.push(data)
     io.to(rooms.socket).emit('groupUpdate',arr)
     console.log("send to client:", arr)
    });
    socket.on('error', (err) =>{
      console.log("Error", err);
    });
 
 socket.on ('tweet', (data)=>{
      console.log('tweet message received', data.text)
      io.to(rooms.socket).emit('tweet', data)
  })

  socket.on('disconnect', () => console.log('Client disconnected'));
});

module.exports = server;
