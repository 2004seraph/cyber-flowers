"use strict";

export class Snowflake {
  constructor(x, y, dx, dy, w, h) {
    this.pos = {x: x, y: y}
    this.velocity = {x: dx, y: dy}

    this.spin = Math.random() * Math.PI * 2

	this.CANX = w
	this.CANY = h
  }

  update(t) {
    this.pos.x += this.velocity.x
    this.pos.y += this.velocity.y

    this.pos.x += Math.sin(t/60 + this.spin)
    this.pos.y += Math.cos(t/60 + this.spin)

    let centerHeading = {x: this.CANX/2 - this.pos.x, y: this.CANY/2 - this.pos.y}
    let centerHeadingMag = Math.sqrt((centerHeading.x) ** 2 + (centerHeading.y) ** 2)
    let centerHeadingNomalized = {x: centerHeading.x/centerHeadingMag, y: centerHeading.y/centerHeadingMag}

    let factor = (2)**6
    this.velocity.x += centerHeadingNomalized.x / factor
    this.velocity.y += centerHeadingNomalized.y / factor
  }

  write(cellArray) {
    cellArray[Math.floor(this.pos.y)][Math.floor(this.pos.x)] = 1

    // cellArray[Math.floor(this.pos.y) - 1][Math.floor(this.pos.x)] = 1
    // cellArray[Math.floor(this.pos.y) + 1][Math.floor(this.pos.x)] = 1

    // cellArray[Math.floor(this.pos.y) - 1][Math.floor(this.pos.x) - 1] = 1
    // cellArray[Math.floor(this.pos.y) + 1][Math.floor(this.pos.x) + 1] = 1
    // cellArray[Math.floor(this.pos.y) + 1][Math.floor(this.pos.x) - 1] = 1
    // cellArray[Math.floor(this.pos.y) - 1][Math.floor(this.pos.x) + 1] = 1

    // cellArray[Math.floor(this.pos.y)][Math.floor(this.pos.x) - 1] = 1
    // cellArray[Math.floor(this.pos.y)][Math.floor(this.pos.x) + 1] = 1
  }

  onScreen() {
    if (this.pos.x < (this.CANX - 1) && this.pos.x > 1) {
      if (this.pos.y < (this.CANY - 1) && this.pos.y > 1) {
        return true
      }
    }
    return false
  }
}