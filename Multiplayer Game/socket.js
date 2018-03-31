var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var logmaker = require("logmaker")
logmaker.enable()

io.socketPort = 3000
app.listen(io.socketPort);

let ws = {
  w: 128000,
  h: 72000
}

let connectedPlayers = []

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
  connectedPlayers.push(socket)

  if (connectedPlayers > 1) {
    socket[0].disconnect()
    console.log("Disconnection")
  }

  socket.on("testMessage", msg => {
    logmaker.log(msg);
    socket.broadcast.emit("testMessage", msg)
  })
  socket.on("refresh", dat => {
    socket.broadcast.emit("update", dat)
  })
  socket.on("p2", dat => {
    socket.broadcast.emit("p2", dat)
  })
  socket.on("windowSize", data => {
    ws.w = Math.min(ws.w, data.w)
    ws.h = Math.min(ws.h, data.h)
    io.sockets.emit("windowSize",ws)
    logmaker.log(ws)
  })
  //gameCalls

  socket.on("damage", amnt => {
    socket.broadcast.emit("damage", amnt)
  })

  socket.on("loss", () => {
    socket.broadcast.emit("win", null)
  })

});

module.exports = io;

//logmaker.log(io)
