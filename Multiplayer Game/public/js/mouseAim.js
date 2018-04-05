class cursor {
  constructor () {
    this.pos = createVector(mouseX, mouseY)
    this.angle = 0;
  }
  update() {

    this.pos.x = (mouseX - (width/2)) + pcam.pos.x
    this.pos.y = (mouseY - (height/2)) + pcam.pos.y

    this.angle = p5.Vector.sub(p1.pos, this.pos).heading()

    if (!settings.autoPlayerRotation)
      p1.angle = (HALF_PI + (0-this.angle)) + PI
  }
}
