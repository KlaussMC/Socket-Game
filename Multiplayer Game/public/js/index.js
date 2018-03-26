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

  window.localStorage.name = window.localStorage.name||prompt("what is your name?")
  p1 = new player(window.localStorage.name, true)
}
function draw() {
  background(0, 50);
  translate(width / 2, height / 2);

  p1.show()
  p1.update()

  if (p2) {
    p2.show();
    p2.update();
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