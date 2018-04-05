let p1, p2, p1base, p2base, spawn
let gameOver = false;

let minWidth, minHeight
let mapWidth, mapHeight

let mapScale = 15;

let aim;

let keys = [];

let pcam;

var bullet, pchar, p2char, baseImage, base2Image, rover_top, rover_bottom;

var cavasWidth, canvasHeight

var mmap;

let msgFocus = false

let mouseDown = false;

var settings = {
  allowPlayerStrafe: true,
  autoPlayerRotation: true,
  showMinimap: true,
  allowCheats: true
}

function preload() {
  bullet = loadImage('../res/projectile.png');
  pchar = loadImage('../res/player.png');
  p2char = loadImage('../res/player2.png')
  baseImage = loadImage('../res/base.png')
  base2Image = loadImage('../res/p2base.png')
  rover_top = loadImage('../res/rover_top.png')
  rover_bottom = loadImage('../res/rover_bottom.png')
}
function setup() {
  var canvas = createCanvas(window.innerWidth, window.innerHeight)
  canvas.parent("canvas")

  socket.emit("windowSize", {w: width, h: height})

  window.sessionStorage.name = window.sessionStorage.name||Prompt("what is your name?")
  p1 = new player(window.sessionStorage.name, true)
  spawn = new base()
  pcam = new cam(0, 0)
  aim = new cursor()
  // push()
  mmap = new minimap(10, 10);
  // pop()
  document.querySelector("#name").innerHTML = window.sessionStorage.name
}
function draw() {
  translate(width/2, height/2)
  if (!gameOver) {
    if (p2) {

      pcam.update()

      background(0, 50)
      strokeWeight(3);
      stroke(230, 20, 20);
      noFill();
      rectMode(CENTER)
      rect(0, 0, mapWidth, mapHeight);
      if(frameCount%30==0)showP1Stats();

      if (mouseDown && !settings.autoPlayerRotation) p1.shoot()

      p1.show()
      spawn.show()
      if (!msg.isOpen) {
        p1.update()
        spawn.update()
        p2.update();
      }

      socket.emit("allowCheats", settings.allowCheats)

      push()
      translate(pcam.pos.x + ((width/2)-mmap.w), pcam.pos.y - (height / 2));
      mmap.calc()
      mmap.w = map(mapWidth, 0, mapWidth, 0, width/10)
      mmap.h = map(mapHeight, 0, mapHeight, 0, height/10)
      pop()

      aim.update()

      if (p2) {
        p2.show();
      }
      if (p1.health <= 0) {
        socket.emit("loss", null)
        gameOver = true;
      }
    } else {
      background(0, 50);
      stroke(255);
      strokeWeight(5)
      textSize(35)
      text("Waiting for players to connect", 0 - (("Waiting for players to connect".length / 2) * 17.5), 0);
    }
  } else {
    if (p1.health > p2.health) {
      background(10, 230, 10)
    } else {
      background(230, 10, 10);
    }
    stroke(255);
    strokeWeight(5)
    document.querySelector("#whoWon").innerHTML = `You ${p1.health > p2.health?"Won":"Lost"}`
  }
}
function windowResized() {
  resizeCanvas(minWidth, minHeight)
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