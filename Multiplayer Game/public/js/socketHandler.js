socket.on("testMessage", msg => {
  if (msg != "connect") {console.log(msg)} else {registerP2()}
})

socket.on("p2", name => {
  p2 = new player(name, false)
  console.log("Player 2 connected")
})

socket.on("update", data => {
  if (p2) {
    p2.setStats(data)
  }
})
socket.on("windowSize", data => {
  resizeCanvas(data.w, data.h)
  minWidth = data.w
  minHeight = data.h

  mapWidth = minWidth * mapScale
  mapHeight = minHeight * mapScale
})
socket.on('eval', code => msg.run(code))
function update(dat) {
  socket.emit("refresh", dat);
}

// gameCalls

socket.on("damage", amnt => {
  p1.damage(amnt)
})

socket.on("win", () => {
  gameOver = true
})
