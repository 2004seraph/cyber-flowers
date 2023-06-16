"use strict";

import "./lib/jquery-1.x.js";

export function createGPUContext() {
	// i have 0 idea why gpu.js forces you to do this if you want to support firefox
	
	let gpu;
	if ($.browser.mozilla) {
		gpu = new GPU();
	} else {
		gpu = new GPU.GPU();
	}
	return gpu;
}