var minimap = {
  mapWidth: minWidth/10,
  mapHeight: minHeight/10,
  calc: () => {
    let p1Pos = {
      x: map(p1.pos.x, 0-mapWidth/2, mapWidth/2, 0, minimap.mapWidth),
      y: map(p1.pos.y, 0-mapHeight/2, mapHeight/2, 0, minimap.mapHeight)
    }
    let p2Pos = null;
    if (p2) {
      p2Pos = {
        x: map(p2.pos.x, 0-mapWidth/2, mapWidth/2, 0, minimap.mapWidth),
        y: map(p2.pos.y, 0-mapHeight/2, mapHeight/2, 0, minimap.mapHeight)
      }
    }
    if (settings.showMinimap) {
      minimap.show(p1Pos, p2Pos);
    }
  },
  show: (p1pos, p2pos) => {
    // console.log(p1pos, p2pos)
    rect(0, 0, minimap.mapWidth, minimap.mapHeight)
    fill(100, 100, 255);
    ellipse(p1pos.x, p1pos.y, 2, 2);
    if (p2pos != null) {
      fill(255, 100, 100);
      ellipse(p2pos.x, p2pos.y, 2, 2);
    }
    fill(255);
    ellipse(mapWidth/2, mapHeight/2, 3, 3);
  }
}
