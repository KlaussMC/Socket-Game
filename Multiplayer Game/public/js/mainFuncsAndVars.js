let p1, p2, p1base, p2base, spawn
let gameOver = false;
let minWidth, minHeight
let mapWidth, mapHeight
let mapScale = 15;
let aim;
let keys = [];
let pcam;
let bullet, pchar, p2char, baseImage, base2Image, rover_top, rover_bottom, rover_top_enemy, rover_bottom_enemy;
let cavasWidth, canvasHeight
let mmap;
let msgFocus = false
let mouseDown = false;
let obstacles = []

let won = false

var settings = {
  autoPlayerRotation: true,
  showMinimap: true,
  allowCheats: true,
  maxPlayerHealth: 100
}

function keyDown() {
  return keys.length == 0 ? false : true;
}

window.addEventListener("keydown", function (e) {
  if (keys.length != 0)
    keys.push(e.keyCode);
})
window.addEventListener("keyup", function (e) {
  let key = e.keyCode;
  for (let i = keys.length; i > 0; i--) {
    if (keys[i] == key)
      keys.splice(i, 1)
  }
})

function registerP2() {
  try {
    socket.emit("p2", window.sessionStorage.name)
  } catch (e) {
    throw e;
  }

  document.querySelector("#canvas").style.display = "block";
  msg.listener()
  document.querySelector(".startBtn").style.display = "none";
}

function startGame() {
  registerP2()
  socket.emit("testMessage", "connect")
  socket.emit("p1base", {owner: p1base.owner, side: p1base.side})
}

function showP1Stats() {
  document.querySelector("#health").innerHTML = p1.health + "<img src='/res/heart.png'>";
  document.querySelector("#money").innerHTML = "$ " + p1.money;
}

function Prompt(str) {
  document.querySelector(".prompt").style.display = "block"
  document.querySelector(".prompt-header").innerHTML = str
}
window.addEventListener("keydown", e => {
  if (e.keyCode == 9) {
    e.preventDefault();
    msg.open()
  }
})

window.addEventListener("mousedown", () => mouseDown = true)
window.addEventListener("mouseup", () => mouseDown = false)

function sendMessage(msg) {
  socket.emit('evalEnemy', msg)
}

function progressBar(val, color) {
  rectMode(CENTER)
  fill(51)
  noStroke()
  rect(p1.pos.x, p1.pos.y - 50, 100, 5)
  if (!color)
    fill(255, 0, 0)
  else
    fill(0, 255, 0)

  rectMode(CORNER)
  rect(p1.pos.x - 50, p1.pos.y - 52.5, val, 5)
}

{
  let i = null;
  function upgradeItem(id) {
    document.querySelector(".upgrades").style.display = "block";
    i = id
    return i
  }
  function upgrade(item) {
    try {
      p1.rovers[i].upgrade(item)
      document.querySelector(".upgrades").style.display = "none";
    } catch (e) {
      notify("An error occured")
      console.log(e)
      document.querySelector(".upgrades").style.display = "block";
    }
  }
  function still() {
    p1.rovers[i].still ^= 1;
    document.querySelector("#still").innerHTML = p1.rovers[i].still?"Movable":"Stationary"
  }
}
function isColliding(a,b){
  for (let c in obstacles) {
    let d = obstacles[c]
    if (((p1.pos.x > d.pos.x - (d.size/2)) && (p1.pos.x < d.pos.x + (d.size/2))) && ((p1.pos.y > d.pos.y - (d.size/2)) && (p1.pos.y < d.pos.y + (d.size/2)))) {
      // let out = Math.round(map(p5.Vector.sub(p1.pos, d.pos).heading(), -PI, PI, 1, 4))
      // console.log(out)
      // return out
      return 1
    }
  }
  return 0;
}

window.addEventListener("keydown", e => e.keyCode==82?p1.roverList():null)
