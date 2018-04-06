class pbase {
  constructor(side, owner) {
    this.side=side;
    this.owner=owner
    this.healRate = 2;
  }
  show() {
    imageMode(CENTER);
    if (this.side==1){
      image(baseImage, mapWidth/2 - 100, 0)
    } else if (this.side==0) {
      image(base2Image, 0-mapWidth/2 - 100, 0)
    }
  }
  update() {
    // console.log(this.owner);
    if (p1.name == this.owner) {
      if (dist(p1.pos.x, p1.pos.y, (mapWidth / 2) - 100, 0) < p1.health * 2)
        p1.health += this.healRate
        p1.health = constrain(p1.health, 0, settings.maxPlayerHealth)
    }
  }
}
