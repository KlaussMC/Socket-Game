class pbase {
  constructor(side, owner) {
    this.side=side;
    this.owner=owner
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
    console.log(this.owner);
  }
}
