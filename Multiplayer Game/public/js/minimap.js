class minimap {
  constructor(w, h) {
    this.w = w
    this.h = h
  }
  calc () {
    let p1Pos = {
      x: map(p1.pos.x, 0-mapWidth/2, mapWidth/2, 0, this.w),
      y: map(p1.pos.y, 0-mapHeight/2, mapHeight/2, 0, this.h)
    }
    let p2Pos = null;
    if (p2) {
      p2Pos = {
        x: map(p2.pos.x, 0-mapWidth/2, mapWidth/2, 0, this.w),
        y: map(p2.pos.y, 0-mapHeight/2, mapHeight/2, 0, this.h)
      }
    }
    if (settings.showMinimap) {
      this.show(p1Pos, p2Pos);
    }
  }
  show (p1pos, p2pos) {
    // console.log(p1pos, p2pos)
    stroke(255, 0, 0)
    strokeWeight(1);
    rectMode(CORNER)
    fill(0);
    rect(0, 0, this.w, this.h)
    fill(100, 100, 255);
    noStroke()
    ellipse(p1pos.x, p1pos.y, 2, 2);
    if (p2pos != null) {
      fill(255, 100, 100);
      noStroke()
      ellipse(p2pos.x, p2pos.y, 2, 2);
    }
    fill(255);
    ellipse(this.w/2, this.h/2, 3, 3);
  }
}
