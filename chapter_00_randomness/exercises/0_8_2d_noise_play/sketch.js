// Experiment: "Ocean Wave at Night"
//
// Same noise field as Exercise 0.8, but instead of mapping the noise
// value LINEARLY to brightness (0 → black, 1 → white), we use a
// THRESHOLD: most noise values map to deep dark blue, but values
// above ~0.7 jump suddenly to bright white "foam."
//
// This gives the visual impression of dark ocean water with bright
// wave crests, because the bright region only appears where noise
// happens to peak — which is a small minority of the canvas.

function setup() {
  createCanvas(640, 240);
  noiseDetail(7, 0.6);

  loadPixels();
  let xoff = 0.0;
  for (let x = 0; x < width; x++) {
    let yoff = 0.0;
    for (let y = 0; y < height; y++) {
      const n = noise(xoff, yoff);

      let r, g, b;
      if (n < 0.7) {
        // Deep ocean — dark navy with slight variation
        const t = map(n, 0, 0.7, 0, 1);
        r = map(t, 0, 1, 0, 20);
        g = map(t, 0, 1, 5, 30);
        b = map(t, 0, 1, 30, 80);
      } else {
        // Wave foam — sudden bright transition
        const t = map(n, 0.7, 1, 0, 1);
        r = map(t, 0, 1, 20, 255);
        g = map(t, 0, 1, 30, 255);
        b = map(t, 0, 1, 80, 255);
      }

      set(x, y, color(r, g, b));
      yoff += 0.02;
    }
    xoff += 0.02;
  }
  updatePixels();
}

function draw() {}