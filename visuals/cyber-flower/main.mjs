"use strict";

import '/js/lib/p5.js';
p5.disableFriendlyErrors = true;

import { OceanRift_RenderPipeline } from "./ocean-rift-renderer.mjs";

let p5Ctx = new p5((sketch) => {
  const CANX = 900;
  const CANY = CANX;

  const PARTICLES_BATCH_SIZE = Math.PI * 2 * 12;

  let ocean;

  sketch.setup = () => {
    sketch.noCanvas();

    ocean = new OceanRift_RenderPipeline(CANX, CANY);

    ocean.bootstrap(document.getElementsByTagName('body')[0]);
    ocean.initParticles(PARTICLES_BATCH_SIZE);
  };

  sketch.draw = () => {
    ocean.render(PARTICLES_BATCH_SIZE, {
      frameCount: sketch.frameCount,
      rate: 7
    });
  };
})