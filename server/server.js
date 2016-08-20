'use strict';
const dotenv = require('dotenv').config({path: __dirname + '/config.env'});
const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 8000;
const INDEX = path.join(__dirname, '../landing/index.html');
const app = require('./api');
const server = require('http').Server(app)

app.use(express.static(path.join(__dirname, '../landing/')));
app.use(express.static(path.join(__dirname, '../node_modules/')));
console.log('dirname',__dirname);
//app.use((req, res) => res.sendFile(INDEX) )
server.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = require('socket.io')(server);
var rooms = {};
var userId;
var username;
var myRoom = '1';

const db = require('./db/config');

io.on('connection', (socket) => {
            console.log('Client connected');

            socket.on('initialize', (data) => {
                // userId = data.userId;
                // username = data.username;
                // joinRoom(myRoom, socket)
                socket.leave(myRoom);
                myRoom = data.eventId;
              //  console.log('+++++++intialaze client side', data, myRoom)
                socket.join(data.eventId);
                //console.log('joined')
            });

            socket.on('location', (data) => {
                //console.log("Incoming location with updated title:", data)
              //  console.log("Incoming location:", data, myRoom)
                //data.title = username
                //myRoom = toString(data.eventId)
                io.to(data.eventId).emit('groupUpdate', data);
            });

            socket.on('tweet', (data) => {
              //  console.log("Incoming tweet:", data)
                //myRoom = toString(data.eventId)
                io.to(data.eventId).emit('tweet', data.text);
            });

            socket.on('error', (err) => {
                console.log("Error", err);
            });

            socket.on('disconnect', () => console.log('Client disconnected'));

 });
