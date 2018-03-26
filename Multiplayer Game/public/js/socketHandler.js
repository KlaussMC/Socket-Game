socket.on("testMessage", msg => {
  console.log(msg)
})

socket.on("p2", data => {
  p2 = new player(data.name, false)
})

socket.on("update", data => {
  p2.setStats(data)
})

function update(dat) {
  socket.emit("refresh", dat);
}