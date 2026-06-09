// Nature of Code - Example 0.6: A Perlin Noise Walker
//
// A walker whose x and y positions are driven by Perlin noise instead
// of true randomness. Two separate noise "offsets" (tx and ty) are
// advanced each frame, and the noise values they produce are mapped
// from p5's 0-to-1 noise range onto the canvas dimensions.
//
// Unlike random(), noise() returns values that are SMOOTHLY correlated
// from one call to the next when the input changes by a small amount.
// That's why the walker glides instead of jittering.

let walker;

function setup() {
  createCanvas(640, 240); // creating canvas of size 640 x 240
  walker = new Walker(); // creating an instance/object of class Walker
  background(255);
}

function draw() {
  walker.step();
  walker.show();
}

class Walker {
  constructor() {
    this.tx = 0;
    this.ty = 10000;
  }

  step() {
    //{!2} x- and y-position mapped from noise
    this.x = map(noise(this.tx), 0, 1, 0, width);
    this.y = map(noise(this.ty), 0, 1, 0, height);

    //{!2} Move forward through “time.”
    this.tx += 0.01;
    this.ty += 0.01;
  }

  show() {
    strokeWeight(2);
    fill(127);
    stroke(0);
    circle(this.x, this.y, 48);
  }
}
