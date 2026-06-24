// Exercise 0.9: Animate the 2D Noise
//
// Add a third argument to noise() that increments once per cycle
// through draw() to animate the 2D noise.
//
// This version samples noise THREE times per pixel — once for each
// RGB channel — at different positions in the noise field. Because
// each channel reads from a different region, the three colors morph
// independently while all sharing the same time dimension t.

let t = 0.0;

function setup() {
  createCanvas(640, 240);
  noiseDetail(5, 0.5);
}

function draw() {
  loadPixels();
  let xoff = 0.0;
  for (let x = 0; x < width; x++) {
    let yoff = 0.0;
    for (let y = 0; y < height; y++) {
      // Three independent noise samples, offset in the noise field
      const r = noise(xoff,         yoff,         t) * 255;
      const g = noise(xoff + 1000,  yoff + 1000,  t) * 255;
      const b = noise(xoff + 2000,  yoff + 2000,  t) * 255;

      set(x, y, color(r, g, b));

      yoff += 0.005;
    }
    xoff += 0.005;
  }
  updatePixels();
  t += 0.01;
}