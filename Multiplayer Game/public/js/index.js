let p1, p2, p1base
let gameOver = false;

let minWidth, minHeight
let mapWidth, mapHeight

let keys = [];

let pcam;

var bullet, pchar, p2char, baseImage;

var cavasWidth, canvasHeight

var settings = {
  allowPlayerStrafe: true,
  autoPlayerRotation: true,
  showMinimap: true
}

function preload() {
  bullet = loadImage('../res/projectile.png');
  pchar = loadImage('../res/player.png');
  p2char = loadImage('../res/player2.png')
  baseImage = loadImage('../res/base.png')
}
function setup() {
  createCanvas(window.innerWidth, window.innerHeight)

  socket.emit("windowSize", {w: width, h: height})

  window.sessionStorage.name = window.sessionStorage.name||Prompt("what is your name?")
  p1 = new player(window.sessionStorage.name, true)
  p1base = new base()
  pcam = new cam(0, 0)
}
function draw() {
  translate(width/2, height/2)
  if (!gameOver) {
    if (p2) {

      pcam.update()

      background(0, 50)
      strokeWeight(3);
      stroke(230, 20, 20);
      minimap.calc()
      noFill();
      rectMode(CENTER)
      rect(0, 0, mapWidth, mapHeight);
      if(frameCount%30==0)showP1Stats();
      p1.show()
      p1.update()
      p1base.show()
      p1base.update()
      p2.update();
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
}

function startGame() {
  registerP2()
  socket.emit("testMessage", "connect")
}

function showP1Stats() {
  document.querySelector("#health").innerHTML = p1.health;
}

function Prompt(str) {
  document.querySelector(".prompt").style.display = "block"
  document.querySelector(".prompt-header").innerHTML = str
}
