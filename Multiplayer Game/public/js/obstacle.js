class obstacle {
  constructor (data) {
    this.pos = createVector(data.pos.x, data.pos.y)
    this.size = data.size
  }
  show() {
    noFill()
    stroke(30)
    rectMode(CENTER)
    ellipse(this.pos.x, this.pos.y, this.size, this.size)
  }
}
