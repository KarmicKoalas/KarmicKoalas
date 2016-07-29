var app = require("./api");
var server = require("http").Server(app);
var io = require("socket.io")(server);

var bodyParser = require('body-parser');
app.use(bodyParser.json());

io.on("connection", handleClient);

app.listen(8000);
