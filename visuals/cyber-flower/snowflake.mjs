"use strict";

import { Particle } from "../../js/particle.mjs";

export class Snowflake extends Particle {

	constructor(xi, yi, dx, dy) {
		super(xi, yi);
		
		this.velocity = { x: dx, y: dy }

		this.spin = Math.PI * 2;
	}

	update(t) {
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		this.position.x += Math.sin(t / 60 + this.spin);
		this.position.y += Math.cos(t / 60 + this.spin);
		
		// this.#log("updatet: " + t);
		// this.#log("updatev: " + this.velocity.x + ", " + this.velocity.y);
		// this.#log("updatep: " + this.position.x + ", " + this.position.y);

		// let centerHeading = {x: CANX/2 - this.position.x, y: CANY/2 - this.position.y}
		// let centerHeadingMag = Math.sqrt((centerHeading.x) ** 2 + (centerHeading.y) ** 2)
		// let centerHeadingNomalized = {x: centerHeading.x/centerHeadingMag, y: centerHeading.y/centerHeadingMag}

		// let factor = (2)**6
		// this.velocity.x += centerHeadingNomalized.x / factor
		// this.velocity.y += centerHeadingNomalized.y / factor
	}

	write(cellSysten, strength) {
		try {
			// this.update();
			// cellGrid[Math.floor(this.position.y)][Math.floor(this.position.x)] = 1;
			// this.update();
			// cellGrid[Math.floor(this.position.y)][Math.floor(this.position.x)] = 1;
			// this.update();
			// cellGrid[Math.floor(this.position.y)][Math.floor(this.position.x)] = 1;
			// this.update();
			cellSysten.setCell(Math.floor(this.position.y),		Math.floor(this.position.x), 		strength);
			cellSysten.setCell(Math.floor(this.position.y) - 1,	Math.floor(this.position.x), 		strength);
			cellSysten.setCell(Math.floor(this.position.y) + 1,	Math.floor(this.position.x), 		strength);
			cellSysten.setCell(Math.floor(this.position.y) - 1,	Math.floor(this.position.x) - 1, 	strength);
			cellSysten.setCell(Math.floor(this.position.y) + 1,	Math.floor(this.position.x) + 1, 	strength);
			cellSysten.setCell(Math.floor(this.position.y) + 1,	Math.floor(this.position.x) - 1, 	strength);
			cellSysten.setCell(Math.floor(this.position.y) - 1,	Math.floor(this.position.x) + 1, 	strength);
			cellSysten.setCell(Math.floor(this.position.y),		Math.floor(this.position.x) - 1, 	strength);
			cellSysten.setCell(Math.floor(this.position.y),		Math.floor(this.position.x) + 1, 	strength);
		} catch { }
	}
}
