
class projectile {
  constructor(x, y, angle, damage, index) {
    this.pos = createVector(x, y);
    this.damage = damage;
    this.index = index;
    this.angle=angle

    this.vel = createVector(25, 0)
    this.vel.rotate(HALF_PI - this.angle)
    this.vel.setMag(25)
  }
  show() {
    push();
    imageMode(CENTER);
    translate(this.pos.x, this.pos.y)
    rotate(0);
    rotate(HALF_PI+this.vel.heading())
    image(bullet, 0, 0, 10, 10)
    pop();
  }
  update() {
    // push()
    // console.log(this.vel)
    this.vel.rotate(0-this.vel.heading())
    this.vel.rotate(HALF_PI - this.angle)
    this.vel.setMag(25)
    this.pos.add(this.vel);
    // pop()

    if (dist(this.pos.x, this.pos.y, p2.pos.x, p2.pos.y) < 10 + p2.health / 2) {
      p1.money++;
      socket.emit("damage", this.damage)
      p1.removeBullet(this.index-1);
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
      if (dist(this.pos.x, this.pos.y, obstacles[i].pos.x, obstacles[i].pos.y) < obstacles[i].size) {
        // console.log("Obstacle shot")
        obstacles.splice(i, 1)
      }
    }
  }
  getStats(){return{x:this.pos.x,y:this.pos.y,angle: this.vel.heading()}}
}

class bulletImage {
  constructor (x, y, angle) {
    this.pos = createVector(x, y);
    this.angle = angle;
  }
  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(HALF_PI - this.angle);
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
