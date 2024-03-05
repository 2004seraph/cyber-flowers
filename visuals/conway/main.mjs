"use strict";

import '../../js/lib/p5.js';
p5.disableFriendlyErrors = true;
import { createGPUContext } from "../../js/browser.mjs";


let p5Ctx = new p5((sketch) => {
  var CANX = 700
  var CANY = 700

  var cellArray = makeMatrix(CANX, CANY)
  var snow = []
  var running = false

  var renderCanvas
  var isMouseDown = false

  const gpu = createGPUContext()

	
  function makeMatrix(x, y, p=0) {
    return new Array(y).fill(p).map(() => new Array(x).fill(p))
  }

	const render1 = gpu.createKernel(function(matrix) {
	  let cell = matrix[this.thread.y][this.thread.x]
	  let neighbors = matrix[this.thread.y - 1][this.thread.x] + matrix[this.thread.y + 1][this.thread.x] + matrix[this.thread.y][this.thread.x - 1] + matrix[this.thread.y][this.thread.x + 1] + matrix[this.thread.y - 1][this.thread.x - 1] + matrix[this.thread.y - 1][this.thread.x + 1] + matrix[this.thread.y + 1][this.thread.x - 1] + matrix[this.thread.y + 1][this.thread.x + 1]
	
	  if (cell == 1) {
	    if (neighbors == 2 || neighbors == 3) { return 1 }
	    if (neighbors < 2) { return 0 }
	    if (neighbors > 3) { return 0 }
	  } else {
	    if (neighbors == 1) { return 1 }
	  }
	}).setOutput([CANX, CANY])
	const render2 = gpu.createKernel(function(matrix) {
	  let cell = matrix[this.thread.y][this.thread.x]
	  if (cell != 0) {
	    //let distfromcenter = (Math.sqrt((canx/2 - this.thread.x) ** 2 + (cany/2 - this.thread.y) ** 2)) / (canx/2)
	    this.color(1, 1, 1, 1)
	  } else {
	    this.color(0, 0, 0, 1)
	  }
	}).setOutput([CANX, CANY]).setGraphical(true)

  sketch.setup = () => {
    sketch.noCanvas();
	
    renderCanvas = render2.canvas;
    document.getElementsByTagName('body')[0].appendChild(renderCanvas);

		
	  document.body.onclick = function(e) {
		  var rect = renderCanvas.getBoundingClientRect()
		  var x = e.clientX - Math.floor(rect.left)
		  var y = e.clientY - Math.floor(rect.top)
		  console.log(x, y)
		  cellArray[cellArray.length - Math.floor(y)][Math.floor(x)] = 1
		}
		
		document.onmousedown = function() {isMouseDown = true}
		document.onmouseup = function() {isMouseDown = false}
		
		document.body.onmousemove = function(e) { 
		  if (isMouseDown) { 
		    var rect = renderCanvas.getBoundingClientRect()
		    var x = e.clientX - Math.floor(rect.left)
		    var y = e.clientY - Math.floor(rect.top)
		    //console.log(x, y)
		    cellArray[cellArray.length - Math.floor(y)][Math.floor(x)] = 1
		  }
		}
  };

  sketch.draw = () => {
    if (running && sketch.frameCount % 2 == 0) {
      cellArray = render1(cellArray)
    }

    render2(cellArray)
  };

  sketch.keyPressed = () => {
    running = !(running)
  }
})


// OLD CODE

// function setup() {
// 	noCanvas();
	
// 	renderCanvas = render2.canvas;
// 	document.getElementsByTagName('body')[0].appendChild(renderCanvas);
// }

// function draw() {
//   //background(0)
//   if (running && frameCount % 2 == 0) {
//     cellArray = render1(cellArray)
//   }

//   render2(cellArray)
// }

// function keyPressed() {
//   running = !(running)
// }
