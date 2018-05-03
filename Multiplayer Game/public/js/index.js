function preload() {
  bullet = loadImage('../res/projectile.png');
  pchar = loadImage('../res/player.png');
  p2char = loadImage('../res/player2.png')
  baseImage = loadImage('../res/base.png')
  base2Image = loadImage('../res/p2base.png')
  rover_top = loadImage('../res/rover_top.png')
  rover_bottom = loadImage('../res/rover_bottom.png')
  rover_top_enemy = loadImage('../res/rover_top_enemy.png')
  rover_bottom_enemy = loadImage('../res/rover_bottom_enemy.png')
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
  mmap = new minimap(10, 10);

  p1base = new pbase(0, p1.name)

  document.querySelector("#name").innerHTML = window.sessionStorage.name
  obstacles.push(new obstacle({pos: {x: 200, y: 200}, size: 200}))
}
function draw() {
  translate(width/2, height/2)
  if (!gameOver) {
    if (p2) {
      // if (!p2base) p2base = new pbase(1, p2.name)

      pcam.update()

      background(0, 50)
      strokeWeight(3);
      stroke(230, 20, 20);
      noFill();
      rectMode(CENTER)
      rect(0, 0, mapWidth, mapHeight);
      if(frameCount%30==0)showP1Stats();

      if (mouseDown && !settings.autoPlayerRotation) p1.shoot()

      p1base.show()
      p1base.update()

      if (p2base) {
        p2base.show()
        p2base.update()
      }

      p1.show()
      spawn.show()
      if (!msg.isOpen) {
        p1.update()
        spawn.update()
        p2.update();
      }

      for (let i in obstacles) { obstacles[i].show() }

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
        won = false
      }
    } else {
      background(0, 50);
      stroke(255);
      strokeWeight(5)
      textSize(35)
      text("Waiting for players to connect", 0 - (("Waiting for players to connect".length / 2) * 17.5), 0);
    }
  } else {
    if (won === true) {
      background(10, 230, 10)
    } else if (won === false) {
      background(230, 10, 10);
    }
    stroke(255);
    strokeWeight(5)
  }
}
function windowResized() {
  resizeCanvas(minWidth, minHeight)
}
