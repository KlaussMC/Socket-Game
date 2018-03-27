let p1, p2

var bullet, pchar;

let keys = [];

var settings = {
  allowPlayerStrafe: true,
  autoPlayerRotation: true
}

function preload() {
  bullet = loadImage('../res/projectile.png');
  pchar = loadImage('../res/player.png');
}
function setup() {
  createCanvas(window.innerWidth, window.innerHeight)

  window.sessionStorage.name = window.sessionStorage.name||prompt("what is your name?")
  p1 = new player(window.sessionStorage.name, true)
}
function draw() {
  translate(width / 2, height / 2);
  if (!lost) {
    if (p2) {
      background(0, 50);
      p1.show()
      p1.update()
      if (p2) {
        p2.show();
        p2.update();
      }
      if (p1.health <= 0) {
        socket.emit("loss", null)
      }
    } else {
      background(0, 50);
      stroke(255);
      strokeWeight(5)
      textSize(35)
      text("Waiting for players to connect", 0 - (("Waiting for players to connect".length / 2) * 17.5), 0);
    }
  }
}
function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight)
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
