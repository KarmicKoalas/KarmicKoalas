var app = require("express");
var app = require("./api");
var server = require("http").Server(app);
var io = require("socket.io")(server);

var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.listen(3000);

io.on("connection",  (socket) => {  
    console.log('connection')
    var interval = setInterval(function () {
        socket.emit("location", {text:'Hello world!'});
    }, 1000);

    socket.on("disconnect", function () {
   });
 
    socket.on('location', data => {
      console.log("Incoming location:", data)
    })
});
