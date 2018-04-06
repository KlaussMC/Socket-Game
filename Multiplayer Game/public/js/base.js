class base {
  constructor() {
    this.pos = createVector(0, 0);
    this.healRate = 2;
    this.radius = 100
  }
  show() {
    noFill();
    strokeWeight(5)
    stroke(255);
    ellipse(this.pos.x, this.pos.y, this.radius, this.radius)
  }
  update() {
    if (dist(p1.pos.x, p1.pos.y, this.pos.x, this.pos.y) < (p1.health/2) + (this.radius/2)) {
      if (frameCount % 20 == 0) {
        p1.health += this.healRate
        p1.health = constrain(p1.health, 0, settings.maxPlayerHealth)
      }
    }
  }
}
