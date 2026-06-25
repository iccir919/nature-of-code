// Exercise 0.10 — Stage 4: Refactored into a Terrain class
//
// Matches Shiffman's structure from the book. The Terrain class
// encapsulates the grid dimensions, the cached z-values, and the
// methods that compute/render them. The animated camera in draw()
// gives the scene a sense of flying over a landscape.

let land;
let theta = 0;

function setup() {
  createCanvas(640, 400, WEBGL);
  land = new Terrain(20, 800, 600);
}

function draw() {
  background(255);

  // Camera: move the scene back and down, then tilt and rotate
  push();
  translate(0, 20, -200);
  rotateX(PI / 3);
  rotateZ(theta);
  land.calculate();
  land.render();
  pop();

  theta += 0.0025;
}

// Helper: create a 2D array (rows of empty columns)
function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

class Terrain {
  constructor(scl, w, h) {
    this.scl = scl;
    this.w = w;
    this.h = h;
    this.cols = floor(w / scl);
    this.rows = floor(h / scl);
    this.z = make2DArray(this.cols, this.rows);  // cached heights
    this.zoff = 0;                                 // time dimension for noise
  }

  // Compute the z-value at every grid point using noise
  calculate() {
    let xoff = 0;
    for (let i = 0; i < this.cols; i++) {
      let yoff = 0;
      for (let j = 0; j < this.rows; j++) {
        this.z[i][j] = map(noise(xoff, yoff, this.zoff), 0, 1, -120, 120);
        yoff += 0.1;
      }
      xoff += 0.05;
    }
    this.zoff += 0.01;  // advance noise through time each frame
  }

  // Draw the terrain as a grid of QUAD_STRIPs, reading cached z-values
  render() {
    stroke(0);
    for (let x = 0; x < this.cols - 1; x++) {
      beginShape(QUAD_STRIP);
      for (let y = 0; y < this.rows; y++) {
        const xLeft  = x       * this.scl - this.w / 2;
        const xRight = (x + 1) * this.scl - this.w / 2;
        const yPos   = y       * this.scl - this.h / 2;

        // Shade based on height
        const shade = map(this.z[x][y], -120, 120, 0, 255);
        fill(30, shade, 255 - shade)

        vertex(xLeft,  yPos, this.z[x][y]);
        vertex(xRight, yPos, this.z[x + 1][y]);
      }
      endShape();
    }
  }
}