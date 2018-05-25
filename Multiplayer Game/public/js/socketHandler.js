socket.on("testMessage", msg => {
  if (msg != "connect") {console.log(msg);} else { reset() }
})

socket.on("p2", name => {
  p2 = new player(name, false)
  // console.log("Player 2 connected")
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

socket.on("p1base", dat => {
  p2base = p1base
  p2base.side=1
  p1base=new pbase(dat.side, dat.owner)
  socket.emit("p2base", {owner: p2base.owner, side: p2base.side})
})
socket.on("p2base", dat => {
  p2base=new pbase(dat.side, dat.owner)
})

// gameCalls

socket.on("damage", amnt => {
  p1.damage(amnt)
})

socket.on("win", () => {
  gameOver = true
  won = true;
  endGame(won)
  // console.log("Win")
})
socket.on("loss", () => {
  gameOver = true
  won = false
  endGame(won)
  // console.log("Loss")
})

socket.on("captureSync", progress => {
  if (dist(p1.pos.x, p1.pos.y, p2base.pos.x, p2base.pos.y) > 50 + (p1.health / 2)) {
    p1.showCapture(progress, false)
  }
})
socket.on("showRover", dat => {
  let r = new showRover(dat)
  r.show()
  r.showProjectiles()
})

function syncCaptureProgress(progress) {
  socket.emit("captureSync", progress)
}
