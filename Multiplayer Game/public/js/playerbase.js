class pbase {
  constructor(side, owner) {
    this.side=side;
    this.owner=owner
    this.healRate = 2;
    this.pos = createVector();
    this.captureProgress = 0
  }
  show() {
    imageMode(CENTER);
    if (this.side==1){
      this.pos = createVector(mapWidth/2-300, 0)
      image(baseImage, this.pos.x, this.pos.y, 100, 100)
    } else if (this.side==0) {
      this.pos = createVector(0-mapWidth/2+300, 0)
      image(base2Image, this.pos.x, this.pos.y, 100, 100)
    }
  }
  update() {
    if (p1.name == this.owner) {
      if (dist(p1.pos.x, p1.pos.y, (mapWidth / 2) - 100, 0) < p1.health * 2)
        p1.health += this.healRate
        p1.health = constrain(p1.health, 0, settings.maxPlayerHealth)
    }

    if (this.owner == p1.name) {
      if (dist(this.pos.x, this.pos.y, p1.pos.x, p1.pos.y) < 50 + (p1.health/2)) {
        if (p1.baseCapture) {
          if (frameCount%20==0) {
            p2base.captureProgress-=3
          }
          if (p2base.captureProgress <= 0) {
            socket.emit("win", null)
          }
        }
      }
    } else {
      if (dist(this.pos.x, this.pos.y, p1.pos.x, p1.pos.y) < 50 + (p1.health/2)) {
        if (frameCount%20==0) {
          this.captureProgress++;
        }
        if (this.captureProgress>=100) {
          p1.baseCapture=true;
        }
      } else {
        if (!p1.baseCapture) {
          if (frameCount%20==0)
            this.captureProgress-=3;
        }
      }
      p1.showCapture(this.captureProgress, true)
    }
    this.captureProgress = constrain(this.captureProgress, 0, 100)

  }
}
