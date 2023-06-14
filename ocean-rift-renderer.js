"use strict";

class OceanRift_RenderPipeline {
	#CANX = 0;
	#CANY = 0;

	#cellArray = [[]];

	#snow = [];

	#renderProcessingStages = []
	#renderOutputStage = null;

	constructor(width, height) {
		this.#CANX = width;
		this.#CANY = height;

		this.#cellArray = makeMatrix(width, height);
	}

	bootstrap(canvasElement = document.getElementsByTagName('body')[0]) {
		let gpu = new GPU.GPU();

		let kernelConstants = {
			CANX: this.#CANX,
			CANY: this.#CANY
		};

		this.#renderProcessingStages[0] = gpu.createKernel(function(matrix) {
			let y = this.thread.y;
			let x = this.thread.x;

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
				) / 80;

			if (average > 0.08) {
				return average;
			}
			return matrix[y][x] * 0.92;// * distfromcenter// * 0.9

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
				) / (this.constants.CANX / 2);

			this.color(0, cell * distfromcenter, cell + 0.1, 1);

		}, {
			output: [this.#CANX, this.#CANY],
			constants: kernelConstants
		}).setGraphical(true);

		canvasElement.appendChild(this.#renderOutputStage.canvas);
	}

	#particleTick() {
		for (var s = this.#snow.length - 1; s > -1; s--) {
			this.#snow[s].update();
			if (this.#snow[s].onScreen(this.#CANX, this.#CANY)) {

				let strength =
					(
						Math.sqrt(
							(this.#CANX / 2 - this.#snow[s].pos.x) ** 2 + (this.#CANY / 2 - this.#snow[s].pos.y) ** 2
						)
					) / (this.#CANX / 2) * 2;

				this.#snow[s].write(this.#cellArray, strength);
			} else {
				this.#snow.splice(s, 1);
			}
		}
	}

	initParticles(size) {
		for (var i = 0; i < size; i++) {
			let dx = Math.sin(i);
			let dy = Math.cos(i);

			this.#snow.push(new Snowflake(this.#CANX / 2, this.#CANY / 2, dx, dy));
		}

		this.#particleTick();
	}

	render(size, opts) {
		if (frameCount % opts.rate == 1) {
			this.initParticles(size);
		}
		if ((frameCount * 3) % opts.rate == 1) {
			this.initParticles(size);
		}

		this.#particleTick();

		for (let stage of this.#renderProcessingStages) {
			this.#cellArray = stage(this.#cellArray);
		}

		this.#renderOutputStage(this.#cellArray);
	}

	getMatrix() {
		return this.#cellArray;
	}
}