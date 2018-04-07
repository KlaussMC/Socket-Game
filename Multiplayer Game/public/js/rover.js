class rover {
  constructor(x, y, owner, index, stationairy) {
    this.pos = createVector(x, y)
    this.vel = createVector(10, 10);
    this.owner = owner
    this.damage = 2
    this.health = 100
    this.strength = 1;
    this.speed = 3;
    this.attackSpeed = 1;
    this.attackRange = 100;
    this.angle = 0;
    this.still = stationairy

    this.projectiles = [null]

    this.index = index;
  }
  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(HALF_PI + this.vel.heading());
    imageMode(CENTER);
    textAlign(CENTER)

    image(rover_bottom, 0, 0, 50, 50)
    rotate(this.angle + (HALF_PI - this.vel.heading()))
    image(rover_top, 0, 0, 50, 50)
    pop();

    for (let i in this.projectiles) { if(this.projectiles[i]){this.projectiles[i].show()} }
  }
  update() {
    let target = createVector(p1.pos.x, p1.pos.y)
    target.sub(this.pos);
    target.setMag(this.speed)
    this.acc = target;
    this.vel.add(this.acc);

    if (!this.still) {
      if (dist(this.pos.x, this.pos.y, p1.pos.x, p1.pos.y) > p1.health / 2) {//check if in range of owner
        if (dist(this.pos.x, this.pos.y, p1.pos.x, p1.pos.y < 50)) { // check if collision with owner / other rovers
          this.pos.add(this.vel)
        }
      }
      this.vel.limit(this.speed)
    }
    for (let i = this.projectiles.length; i > 0; i--) {
      let p = this.projectiles[i];
      if (p) {
        p.update();
        if (p.pos.x <= 0-mapWidth/2 || p.pos.x >= mapWidth/2 || p.pos.y <= 0-mapHeight/2 || p.pos.y >= mapHeight/2)
          this.projectiles.splice(i, 1)
      }
    }
    if (dist(p2.pos.x, p2.pos.y, this.pos.x, this.pos.y) < this.attackRange*2) {
      this.angle = (PI + Math.atan2(p2.pos.x-this.pos.x, 0-(p2.pos.y-this.pos.y)))
      if (frameCount%(60-this.attackSpeed) == 0) {
        this.shoot()
      }
    }
    this.showOnOtherPlayer()
  }
  shoot() {
    this.projectiles.push(new projectile(this.pos.x, this.pos.y, this.angle*-1, this.damage, this.projectiles.length));
  }
  upgrade(what) {
    if (p1.money > 100) {
      switch (what) {
        case "speed":
          this.speed *= 2
          break;
        case "resistance":
          this.resistance++
          break;
        case "damage":
          if (this.damage)
            this.damage*=2
          else
            this.damage = 2
          break;
        case "attack speed":
          this.attackSpeed++;
          break;
        case "range":
        this.attackRange*=2;
      }
      p1.money -= p1.roverPrice/2;
    } else {
      notify("You Do Not Have Enough Money For This Upgrade")
    }
  }
  getProjectiles() {
    let bullets = [];
    for (let i = 1; i < this.projectiles.length; i++) {
      bullets.push(this.projectiles[i].getStats())
    }
    return bullets
  }
  getStats() {
    return {heading: this.vel.heading(), pos: {x: this.pos.x, y: this.pos.y }, ange: this.angle, projectiles: this.getProjectiles()}
  }
  showOnOtherPlayer() {
    socket.emit("showRover", this.getStats())
  }
}

class showRover {
  constructor(data) {
    this.pos = createVector(data.pos.x, data.pos.y)
    this.angle = data.angle
    this.projectiles = data.projectiles
    this.bottomAngle = data.heading
  }
  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(HALF_PI + this.bottomAngle);
    imageMode(CENTER);
    textAlign(CENTER)

    image(rover_bottom_enemy, 0, 0, 50, 50)
    rotate(this.angle + (HALF_PI - this.bottomAngle))
    image(rover_top_enemy, 0, 0, 50, 50)
    pop();
  }
  showProjectiles(bullets) {
    this.projectiles = [];
    for (let i in bullets) {
      this.projectiles.push(new bulletImage(bullets[i].x, bullets[i].y, bullets[i].angle))
    }
    return this.projectiles;
  }
}
