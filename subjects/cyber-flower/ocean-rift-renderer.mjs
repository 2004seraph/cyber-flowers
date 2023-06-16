"use strict";

import { Matrix } from "/js/matrix.mjs";
import "/js/lib/gpu.js";
import { Snowflake } from "./snowflake.mjs";
import { createGPUContext } from "/js/browser.mjs";

export class OceanRift_RenderPipeline {
	#CANX = 0;
	#CANY = 0;

	#cellArray = [[]];

	#snow = [];

	#renderProcessingStages = []
	#renderOutputStage = null;

	constructor(width, height) {
		this.#CANX = width;
		this.#CANY = height;

		this.#cellArray = Matrix.create(width, height);
	}

	bootstrap(canvasElement = document.getElementsByTagName('body')[0]) {
		let gpu = createGPUContext();

		let kernelConstants = {
			CANX: this.#CANX,
			CANY: this.#CANY
		};

		this.#renderProcessingStages[0] = gpu.createKernel(function(matrix) {
			let y = this.thread.y;
			let x = this.thread.x;

			let distfromcenter =
				(
					Math.sqrt(
						(this.constants.CANX / 2 - this.thread.x) ** 2 + (this.constants.CANY / 2 - this.thread.y) ** 2
					)
				) / (this.constants.CANX / 100);

			let average =
				(
					matrix[y][x - 1] +
					matrix[y][x + 1] +
					matrix[y + 1][x - 1] +
					matrix[y - 1][x - 1] +
					matrix[y + 1][x + 1] +
					matrix[y - 1][x + 1] +
					matrix[y - 1][x] +
					matrix[y + 1][x]
				) / 80; // this divisor creates a maze-like distortion over time

			// this controls the maze-like distortion AMOUNT as you get further from the center / activation distance from center
			// lower = more distortion
			if (average > 0.2) {//0.08
				return average * (1 / distfromcenter) ** distfromcenter;
			}
			// this multiplier controls the fading of older pixels
			// lower = less fading
			return matrix[y][x] * 0.96;// * distfromcenter// * 0.9, 0.92

		}, {
			output: [this.#CANX, this.#CANY],
			constants: kernelConstants
		});

		this.#renderOutputStage = gpu.createKernel(function(matrix) {
			let cell = matrix[this.thread.y][this.thread.x];

			let distfromcenter =
				(
					Math.sqrt(
						(this.constants.CANX / 2 - this.thread.x) ** 2 + (this.constants.CANY / 2 - this.thread.y) ** 2
					)
				);

			let distfromcenterNormalized = distfromcenter / this.constants.CANX;
			let distanceFactor = distfromcenterNormalized * 4;
			let distfromcenterNormalizedFalloff = (1 / (6 * distfromcenterNormalized)) ** 7
			
			this.color(
				(
					(
						Math.sin((this.thread.x * this.thread.y))
					) * cell
				) + distfromcenterNormalizedFalloff, 
				cell * Math.sin((this.thread.x * this.thread.y)) * 0.3 + distfromcenterNormalizedFalloff / 10, 
				(cell + 0.1) * distanceFactor + distfromcenterNormalizedFalloff, 
				1
			);

		}, {
			output: [this.#CANX, this.#CANY],
			constants: kernelConstants
		}).setGraphical(true);

		canvasElement.appendChild(this.#renderOutputStage.canvas);
	}

	#particleTick(t) {
		for (var s = this.#snow.length - 1; s > -1; s--) {
			this.#snow[s].update(t);
			
			if (this.#snow[s].onScreen(this.#CANX, this.#CANY, -10)) {

				let strength =
					(
						Math.sqrt(
							(this.#CANX / 2 - this.#snow[s].position.x) ** 2 + (this.#CANY / 2 - this.#snow[s].position.y) ** 2
						)
					) / (this.#CANX / 2) * 2;

				this.#snow[s].write(this, strength);
			} else {
				this.#snow.splice(s, 1);
			}
		}
	}

	setCell(x, y, value) {
		this.#cellArray[y][x] = value
	}

	initParticles(size) {
		for (var i = 0; i < size; i++) {
			let dx = Math.sin(i);
			let dy = Math.cos(i);
			// console.log(this.#CANX / 2, this.#CANY / 2)
			this.#snow.push(new Snowflake(this.#CANX / 2, this.#CANY / 2, dx, dy));
		}

		// this.#snow[0].debug = true;
		// console.log(this.#snow[0].position);

		this.#particleTick(0);
	}

	render(size, opts) {
		if (opts.frameCount % opts.rate == 1) {
			this.initParticles(size);
		}
		if ((opts.frameCount * 3) % opts.rate == 1) {
			this.initParticles(size);
		}

		this.#particleTick(opts.frameCount);

		for (let stage of this.#renderProcessingStages) {
			this.#cellArray = stage(this.#cellArray);
		}

		this.#renderOutputStage(this.#cellArray);
	}

	getMatrix() {
		return this.#cellArray;
	}
}