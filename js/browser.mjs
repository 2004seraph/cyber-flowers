export function createGPUContext() {
  // i have 0 idea why gpu.js forces you to do this if you want to support firefox

  let gpu;
  try {
    gpu = new window.GPU();
    console.log("FIREFOX")
  } catch {
    gpu = new window.GPU.GPU();
    console.log("WEBKIT")
  }
  return gpu;
}