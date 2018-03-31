class player {
  constructor(name, useControls) {
    this.name = name
    this.useControls = useControls

    this.pos = createVector(0, 0)
    this.vel = createVector(0, 0);
    this.angle = 0;
    this.dir = 0
    this.health = 100

    this.projectiles = [null]

    this.moving = false;
  }
  show() {
    noStroke();
    fill(255);

    for (let i in this.projectiles) { if(this.projectiles[i]){this.projectiles[i].show()} }

    push();
    translate(this.pos.x, this.pos.y);
    rotate(PI - this.angle);
    imageMode(CENTER);
    textAlign(CENTER)
    if (this.useControls) {
      if (this.health != 0)
        image(pchar, 0, 0, this.health / 2, this.health / 2);
    } else {
      if (this.health != 0)
        image(p2char, 0, 0, this.health / 2, this.health / 2);
    }
    pop();
    textSize(15);
    noStroke();
    fill(255);
    text(this.name, this.pos.x, this.pos.y-25);
  }
  update() {
    this.vel = createVector(0, 0)

    if (this.useControls) {
      if (!settings.allowPlayerStrafe) {
        if (keyIsDown(87)) {
          this.dir = 1;
        } else if (keyIsDown(83)) {
          this.dir = -1;
        } else if (!keyIsDown(87) && !keyIsDown(83))
          this.dir = 0;

        if (keyIsDown(68))
          this.angle -= 0.05;
        if (keyIsDown(65))
          this.angle += 0.05;

        this.pos.x += ((this.health / 10) * sin(this.angle)) * this.dir;
        this.pos.y += ((this.health / 10) * cos(this.angle)) * this.dir;

      } else {

        if (keyIsDown(68)) {
          this.vel.x = 1 * (this.health / 10);
          if (settings.autoPlayerRotation) this.angle = HALF_PI - this.vel.heading();
        }
        if (keyIsDown(65)) {
          this.vel.x = -1 * (this.health / 10);
          if (settings.autoPlayerRotation) this.angle = HALF_PI - this.vel.heading();
        }

        if (keyIsDown(87)) {
          this.dir = 1
          this.vel.y = -1 * (this.dir * (this.health / 10));
          if (settings.autoPlayerRotation) this.angle = HALF_PI - this.vel.heading();
        } else if (keyIsDown(83)) {
          this.dir = -1
          this.vel.y = -1 * (this.dir * (this.health / 10));
          if (settings.autoPlayerRotation) this.angle = HALF_PI - this.vel.heading();
        } else if (!keyIsDown(87) && !keyIsDown(83)) {
          this.dir = 0;
        }

        if (!settings.autoPlayerRotation) {
          if (keyIsDown(37))
            this.angle += 0.05;
          if (keyIsDown(39))
            this.angle -= 0.05
        }
        this.pos.add(this.vel)
        this.sendStats()
      }

      this.pos.x = constrain(this.pos.x, 0-mapWidth/2, mapWidth/2);
      this.pos.y = constrain(this.pos.y, 0-mapHeight/2, mapHeight/2);

      if (keyIsDown(32))
        this.shoot()

      for (let i = this.projectiles.length; i > 0; i--) {
        let p = this.projectiles[i];
        if (p) {
          p.update();
          if (p.pos.x <= 0-mapWidth/2 || p.pos.x >= mapWidth/2 || p.pos.y <= 0-mapHeight/2 || p.pos.y >= mapHeight/2)
            this.projectiles.splice(i, 1)
        }
      }
    }
  }
  shoot() {
    if (frameCount % 10 == 0) this.projectiles.push(new projectile(this.pos.x, this.pos.y, this.angle, 10, this.projectiles.length));
  }
  damage(amnt) {
    this.health -= amnt;
    this.health = constrain(this.health, 0, 100)
    if (this.health == 0)
      console.log("He dedd")
  }
  removeBullet(index) {
    this.projectiles.splice(index, 1)
  }
  setStats(data) {
    this.pos = createVector(data.pos.x, data.pos.y);
    this.health = data.health;
    this.projectiles=this.showProjectiles(data.projectiles)
    this.angle = data.angle
  }
  sendStats() {
    update({name: this.name, health: this.health, pos: {x: this.pos.x, y: this.pos.y}, projectiles: this.getProjectiles(), angle: this.angle})
  }
  getProjectiles() {
    let bullets = [];
    for (let i = 1; i < this.projectiles.length; i++) {
      bullets.push({x: this.projectiles[i].pos.x, y:this.projectiles[i].pos.y, angle: this.projectiles[i].angle })
    }
    return bullets
  }
  showProjectiles(bullets) {
    this.projectiles = [];
    for (let i in bullets) {
      this.projectiles.push(new bulletImage(bullets[i].x, bullets[i].y, bullets[i].angle))
    }
    return this.projectiles;
  }
}
class projectile {
  constructor(x, y, angle, damage, index) {
    this.pos = createVector(x, y);
    this.angle = angle;
    // this.angle += random(-0.01, 0.01);
    this.damage = damage;
    this.index = index;
  }
  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(PI - this.angle);
    imageMode(CENTER);
    image(bullet, 0, 0, 10, 10);
    pop();

  }
  update() {
    this.pos.x += 25 * sin(this.angle)
    this.pos.y += 25 * cos(this.angle)

    if (dist(this.pos.x, this.pos.y, p2.pos.x, p2.pos.y) < 10 + p2.health / 2) {
      socket.emit("damage", this.damage)
      p1.removeBullet(this.index);
    }
  }
}

class bulletImage {
  constructor (x, y, angle) {
    this.pos = createVector(x, y);
    this.angle = angle;
  }
  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(PI - this.angle);
    imageMode(CENTER);
    image(bullet, 0, 0, 10, 10);
    pop();
  }
}

function generateId() {
  let str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let id = "";
  for (let i = 0; i < Math.floor(Math.random()*15) + 5; i++) {
    id += str[Math.floor(Math.random() * str.length) - 1]
  }
  return id
}
