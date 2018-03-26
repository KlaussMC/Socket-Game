var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var logmaker = require("logmaker")
logmaker.enable()

io.socketPort = 3000
app.listen(io.socketPort);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', socket => {
  logmaker.log(socket.handshake.adress || "Join");

  socket.on("testMessage", msg => {
    logmaker.log(msg);
    io.sockets.emit("testMessage", msg)
  })
  socket.on("refresh", dat => {
    socket.broadcast.emit("update", dat)
  })
  socket.on("p2", dat => {
    socket.broadcast.emit("p2", dat)
  })
});

module.exports = io;

//logmaker.log(io)
