"use strict";

const CANX = 900;
const CANY = CANX;

const PARTICLES_BATCH_SIZE = Math.PI * 2 * 12;

let ocean;

function setup() {
	noCanvas();
	ocean = new OceanRift_RenderPipeline(CANX, CANY);
	ocean.bootstrap();
	ocean.initParticles(PARTICLES_BATCH_SIZE);
}

function draw() {
	ocean.render(PARTICLES_BATCH_SIZE, {
		rate: 2
	});
}