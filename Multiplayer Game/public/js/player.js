class player {
  constructor(name, useControls) {
    this.name = name
    this.useControls = useControls

    this.pos = createVector(0, 0)
    this.vel = createVector(0, 0);
	this.sprinting = {startTime: 0, cooldown: 10000, able: false};
    this.angle = 0;
    this.dir = 0
    this.health = settings.maxPlayerHealth
	this.speed = this.health / 10;

    this.projectiles = [null]
    this.rovers = [];
    this.roverPrice = 50;

    this.moving = false;

    this.money = 0;
    this.invincible = false;
    this.visible = true;
    this.baseCapture = false

    this.roverListOpen = false;
    this.lastXDir = 0
    this.lastYDir = 0
  }
  show() {
    noStroke();
    fill(255);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(PI - this.angle);
    imageMode(CENTER);
    textAlign(CENTER)
    if (this.useControls) {
      if (this.health != 0)
        image(pchar, 0, 0, this.health / 2, this.health / 2);
    } else {
      if (this.health != 0 && this.visible)
        image(p2char, 0, 0, this.health / 2, this.health / 2);
    }
    pop();
    textSize(15);
    noStroke();
    fill(255);
    if (this.visible)
      text(this.name, this.pos.x, this.pos.y-25);
    for (let i in this.projectiles) { if(this.projectiles[i]){this.projectiles[i].show()} }
    for (let i in this.rovers) { if(this.rovers[i]){this.rovers[i].show()} }
  }
  update() {
	this.checkSprint()
    this.vel = createVector(0, 0)

    if (this.useControls) {
      if (keyIsDown(68)) {
        if (isColliding(this.pos.x, this.pos.y) == 0) {
            this.vel.x = 1 * (this.speed);
            this.lastXDir = 2
          // dir 2
        } else {
          if (this.lastXDir != 2) {
            this.vel.x = 1 * (this.speed);
            this.lastXDir = 2
          }
        }
        if (settings.autoPlayerRotation) this.angle = HALF_PI - this.vel.heading();
      }
      if (keyIsDown(65)) {
        if (isColliding(this.pos.x, this.pos.y) == 0) {
            this.vel.x = -1 * (this.speed);
            this.lastXDir = 1
          // dir 1
        } else {
          if (this.lastXDir != 1) {
            this.vel.x = -1 * (this.speed);
            this.lastXDir = 1
          }
        }
        if (settings.autoPlayerRotation) this.angle = HALF_PI - this.vel.heading();
      }

      if (keyIsDown(87)) {
        this.dir = 1
        if (isColliding(this.pos.x, this.pos.y) == 0) {
            this.vel.y = -1 * (this.dir * (this.speed));
            this.lastYDir = 4
          //dir 4
        } else {
          if (this.lastYDir != 4) {
            this.vel.y = -1 * (this.dir * (this.speed));
            this.lastYDir = 4
          }
        }

        if (settings.autoPlayerRotation) this.angle = HALF_PI - this.vel.heading();
      } else if (keyIsDown(83)) {
        this.dir = -1
        if (isColliding(this.pos.x, this.pos.y) == 0) {
          this.vel.y = -1 * (this.dir * (this.speed));
          this.lastYDir = 3
          // dir 3
        } else {
          if (this.lastYDir != 3) {
            this.vel.y = -1 * (this.dir * (this.speed));
            this.lastYDir = 3
          }
        }

        if (settings.autoPlayerRotation) this.angle = HALF_PI - this.vel.heading();
      } else if (!keyIsDown(87) && !keyIsDown(83)) {
        this.dir = 0;
      }

      if (!settings.autoPlayerRotation) {
        if (keyIsDown(37))
          this.angle += 0.05;
        if (keyIsDown(39))
          this.angle -= 0.05
      }
      this.pos.add(this.vel)
      this.sendStats()

      this.pos.x = constrain(this.pos.x, 0-mapWidth/2, mapWidth/2);
      this.pos.y = constrain(this.pos.y, 0-mapHeight/2, mapHeight/2);

      if (keyIsDown(32))
        this.shoot()

      for (let i = this.projectiles.length; i > 0; i--) {
        let p = this.projectiles[i];
        if (p) {
          p.update();
          if (p.pos.x <= 0-mapWidth/2 || p.pos.x >= mapWidth/2 || p.pos.y <= 0-mapHeight/2 || p.pos.y >= mapHeight/2)
            this.projectiles.splice(i, 1)
        }
      }

      this.showRovers=[]
      for (let i in this.rovers) {
        if(this.rovers[i]){
          this.rovers[i].update()
          this.showRovers.push(this.rovers[i].getStats())
        }
      }
    }
  }
  shoot() {
    if (frameCount % 10 == 0) this.projectiles.push(new projectile(this.pos.x, this.pos.y, this.angle, 10, this.projectiles.length));
  }
  damage(amnt) {
    if (this.invincible === false || millis() < 10e3) {
      this.health -= amnt;
      this.health = constrain(this.health, 0, settings.maxPlayerHealth)
      if (this.health == 0)
        console.log("He dedd")
    }
  }
  removeBullet(index) {
    this.projectiles.splice(index, 1)
  }
  setStats(data) {
    this.pos = createVector(data.pos.x, data.pos.y);
    this.health = data.health;
    this.projectiles=this.showProjectiles(data.projectiles)
    this.angle = data.angle
    this.visible=data.visible;
  }
  sendStats() {
    update({name: this.name, health: this.health,
            pos: {x: this.pos.x, y: this.pos.y},
            projectiles: this.getProjectiles(),
            angle: this.angle,
            visible:this.visible
          })
  }
  getProjectiles() {
    let bullets = [];
    for (let i = 1; i < this.projectiles.length; i++) {
      bullets.push(this.projectiles[i].getStats())
    }
    return bullets
  }
  showProjectiles(bullets) {
    this.projectiles = [];
    for (let i in bullets) {
      this.projectiles.push(new bulletImage(bullets[i].x, bullets[i].y, bullets[i].angle))
    }
    return this.projectiles;
  }
  addRover() {
    if (this.rovers.length < 4) {
      if (this.money > this.roverPrice) {
        this.rovers.push(new rover(p1.pos.x, p1.pos.y, window.sessionStorage.name, this.rovers.length - 1))
        this.money -= this.roverPrice;
      } else {
        notify("You do not have enough money to buy a rover")
      }
    } else {
      notify("You do not have enough room for a fourth rover")
    }
  }
  showCapture(progress, capturer) {
    if (progress > 0) {
      progressBar(progress, capturer)
    }
  }
  roverList() {
    if (!gameOver && document.querySelector("#canvas").style.display == "block" && !msg.isOpen) {
      this.roverListOpen=!this.roverListOpen;
      if (this.roverListOpen) {
        document.querySelector(".roverList").style.display="block"
        document.querySelector(".upgrades").style.display="none"
        let rovers=""

        for (let i in this.rovers) { rovers+=`<div class="rover" onclick="upgradeItem(${i})">Rover ${i+1}</div><br>` }

        document.querySelector("#Rovers").innerHTML=rovers
      } else {
        document.querySelector(".roverList").style.display="none"
      }
    }
  }
	checkSprint() {
		if (this.sprinting.able) {
			if (16 in keys) {
				this.speed = 30
			}
		} else {
			this.sprinting.able = false;
			if (this.sprinting.cooldown >= 10000) {
				if (millis() % 10 == 0) {
					this.sprinting.cooldown -= 10
				}
			} else {
				this.sprinting.cooldown = 10000
				this.sprinting.able = true
			}
		}
	}
}
