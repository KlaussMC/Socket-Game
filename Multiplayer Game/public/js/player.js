class player {
  constructor(name, useControls) {
    this.name = name
    this.useControls = useControls

    this.pos = createVector(0, 0)
    this.vel = createVector(0, 0);
    this.angle = 0;
    this.dir = 0
    this.health = 100

    this.projectiles = []

    this.moving = false;

  }

  show() {
    noStroke();
    fill(255);

    for (let i in this.projectiles) { this.projectiles[i].show() }

    push();
    translate(this.pos.x, this.pos.y);
    rotate(PI - this.angle);
    imageMode(CENTER);
    if (this.health != 0)
      image(pchar, 0, 0, this.health / 2, this.health / 2);
    pop();
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
      }

      this.pos.x = constrain(this.pos.x, 0 - width / 2, width / 2);
      this.pos.y = constrain(this.pos.y, 0 - height / 2, height / 2);

      if (keyIsDown(32))
        this.shoot()

      for (let i in this.projectiles) {
        this.projectiles[i].update()
        let a = this.projectiles[i].pos.x
        let b = this.projectiles[i].pos.y

        if ((a <= 0 - width / 2 || a >= width / 2) || (b <= (0 - height / 2) - height || b >= height / 2))
          this.projectiles.splice(i, 1)
      }
    }
  }
  shoot() {
    if (frameCount % 10 == 0) this.projectiles.push(new projectile(this.pos.x, this.pos.y, this.angle, 10, this.name==window.localStorage.name?1:2));
  }
  damage(amnt) {
    this.health -= amnt;
    this.health = constrain(this.health, 0, 100)
    if (this.health == 0)
      console.log("He dedd")
  }
  setStats(data) {
    this.pos = data.pos;
    this.projectiles = data.projectiles;
    this.health = data.health;
  }
  sendStats() {
    let data = {
      pos: this.pos,
      projectiles: this.projectiles,
      health: this.health
    }
    update(data)
  }
}
class projectile {
  constructor(x, y, angle, damage, owner) {
    this.pos = createVector(x, y);
    this.angle = angle;
    this.angle += random(-0.01, 0.01);
    this.damage = damage;
    this.owner = owner;

    //console.log("Pew Pew");
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

    if (this.owner == 1)
      if (p2) if (dist(this.pos.x, this.pos.y, p2.pos.x, p2.pos.y) < 10 + p2.health / 2) p2.damage(this.damage)
    else if (this.owner == 2)
      if (dist(this.pos.x, this.pos.y, p1.pos.x, p1.pos.y) < 10 + p1.health / 2) p1.damage(this.damage)
    
  }
}
