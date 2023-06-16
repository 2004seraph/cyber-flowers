"use strict";

export class Particle {
	position = {
		x: 0,
		y: 0
	}
	debug = false;
	
	constructor(x, y) {
		this.position = {
			x: x,
			y: y
		}
		
		this.debug = false;
	}

	#log(output) {
		if (this.debug)
			console.log(output);
	}

	onScreen(width, height, squeeze) {
		if (this.position.x < (width - squeeze) && this.position.x > squeeze) {
			if (this.position.y < (height - squeeze) && this.position.y > squeeze) {
				return true;
			}
		}
		return false;
	}
}