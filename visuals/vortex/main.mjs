import '/js/lib/p5.js';
p5.disableFriendlyErrors = true;
import { Matrix } from "/js/matrix.mjs";
import "/js/lib/gpu.js";
import { Snowflake } from "./snowflake.mjs";
import { createGPUContext } from "/js/browser.mjs";


let p5Ctx = new p5((sketch) => {
	const CANX = 700
	const CANY = 700
	
	var cellArray = Matrix.create(CANX, CANY)
	var snow = []
	
	const gpu = createGPUContext()
	
	const render1 = gpu.createKernel(function(matrix, canx, cany) {
		let cell = matrix[this.thread.y][this.thread.x]
		if (cell != 0) {
			let distfromcenter = (Math.sqrt((canx / 2 - this.thread.x) ** 2 + (cany / 2 - this.thread.y) ** 2)) / (canx / 2)
			this.color(0, 1, distfromcenter, 1)
		} else {
			this.color(0, 0, 0, 1)
		}
	}).setOutput([CANX, CANY]).setGraphical(true)
	
	const renderCanvas = render1.canvas
	document.getElementsByTagName('body')[0].appendChild(renderCanvas)
	
	sketch.setup = () => {
		sketch.noCanvas();
		for (var i = 0; i < 100000; i++) {
			let dx = (Math.random() - Math.random())
			let dy = (Math.random() - Math.random())
			snow.push(new Snowflake(Math.floor(CANX / 2), Math.floor(CANY / 2), dx, dy, CANX, CANY))
		}
	}
	
	sketch.draw = () => {
		//background(0)
		cellArray = Matrix.create(CANX, CANY)
		for (var s = snow.length - 1; s > -1; s--) {
			snow[s].update(sketch.frameCount)
			if (snow[s].onScreen()) {
				snow[s].write(cellArray)
			}
		}
	
		render1(cellArray, CANX, CANY)
	}
})