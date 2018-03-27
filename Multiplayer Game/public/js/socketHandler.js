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

function update(dat) {
  socket.emit("refresh", dat);
}

// gameCalls

socket.on("damage", amnt => {
  p1.damage(amnt)
})

socket.on("win", () => {
  
})
