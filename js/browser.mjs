import "./lib/jquery-1.x.js";

export function createGPUContext() {
  // i have 0 idea why gpu.js forces you to do this if you want to support firefox

  let gpu;
  if ($.browser.mozilla) {
    gpu = new window.GPU();
  } else {
    gpu = new window.GPU.GPU();
  }
  return gpu;
}