class cam {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.camSpeed = 4.5;
  }

  update() {
    // this.camSpeed = dist(this.pos.x, this.pos, p1.pos.x, this.pos.y)
    let target = createVector(p1.pos.x, p1.pos.y)
    target.sub(this.pos);
    target.setMag(this.camSpeed)
    this.acc = target;
    this.vel.add(this.acc);

    if (dist(this.pos.x, this.pos.y, p1.pos.x, p1.pos.y) > p1.health / 2)
      this.pos.add(this.vel);

    this.vel.limit(this.camSpeed)

    translate(0-this.pos.x, 0-this.pos.y)
	// translate(0-p1.pos.x, 0-p1.pos.y)
    // stroke(255);
    // point(this.pos.x, this.pos.y)
  }
}
