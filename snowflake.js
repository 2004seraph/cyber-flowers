"use strict";

class Snowflake {
	constructor(x, y, dx, dy) {
		this.pos = { x: x, y: y }
		this.velocity = { x: dx, y: dy }

		this.spin = Math.PI * 2;
	}

	update() {
		this.pos.x += this.velocity.x;
		this.pos.y += this.velocity.y;

		this.pos.x += Math.sin(frameCount / 60 + this.spin);
		this.pos.y += Math.cos(frameCount / 60 + this.spin);

		// let centerHeading = {x: CANX/2 - this.pos.x, y: CANY/2 - this.pos.y}
		// let centerHeadingMag = Math.sqrt((centerHeading.x) ** 2 + (centerHeading.y) ** 2)
		// let centerHeadingNomalized = {x: centerHeading.x/centerHeadingMag, y: centerHeading.y/centerHeadingMag}

		// let factor = (2)**6
		// this.velocity.x += centerHeadingNomalized.x / factor
		// this.velocity.y += centerHeadingNomalized.y / factor
	}

	write(cellGrid, strength) {
		try {
			// this.update();
			// cellGrid[Math.floor(this.pos.y)][Math.floor(this.pos.x)] = 1;
			// this.update();
			// cellGrid[Math.floor(this.pos.y)][Math.floor(this.pos.x)] = 1;
			// this.update();
			// cellGrid[Math.floor(this.pos.y)][Math.floor(this.pos.x)] = 1;
			// this.update();
			cellGrid[Math.floor(this.pos.y)][Math.floor(this.pos.x)]		 = strength;
			cellGrid[Math.floor(this.pos.y) - 1][Math.floor(this.pos.x)]	 = strength;
			cellGrid[Math.floor(this.pos.y) + 1][Math.floor(this.pos.x)]	 = strength;
			cellGrid[Math.floor(this.pos.y) - 1][Math.floor(this.pos.x) - 1] = strength;
			cellGrid[Math.floor(this.pos.y) + 1][Math.floor(this.pos.x) + 1] = strength;
			cellGrid[Math.floor(this.pos.y) + 1][Math.floor(this.pos.x) - 1] = strength;
			cellGrid[Math.floor(this.pos.y) - 1][Math.floor(this.pos.x) + 1] = strength;
			cellGrid[Math.floor(this.pos.y)][Math.floor(this.pos.x) - 1]	 = strength;
			cellGrid[Math.floor(this.pos.y)][Math.floor(this.pos.x) + 1]	 = strength;
		} catch { }
	}

	onScreen(width, height) {
		if (this.pos.x < (width - 1) && this.pos.x > 1) {
			if (this.pos.y < (height - 1) && this.pos.y > 1) {
				return true;
			}
		}
		return false;
	}
}