class obstacle {
  constructor (data) {
    this.pos = createVector(data.pos.x, data.pos.y)
    this.size = data.size
  }
  show() {
    noFill()
    stroke(30)
    rectMode(CENTER)
    rect(this.pos.x, this.pos.y, this.size, this.size)
  }
  isColliding(x, y) { return dist(this.pos.x, this.pos.y, x, y) < this.size?true:false }
}
