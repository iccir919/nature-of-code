// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

let walker;

function setup() {
  createCanvas(640, 240);
  walker = new Walker();
  background(255);
}

function draw() {
  walker.step();
  walker.show();
}

class Walker {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.tx = random(1000);
    this.ty = random(1000);
  }

  show() {
    stroke(0);
    point(this.x, this.y);
  }

  step() {
    const stepSize = 1.5;

    let stepX = map(noise(this.tx), 0, 1, -stepSize, stepSize);
    this.x += stepX;
    this.tx += 0.01;

    let stepY = map(noise(this.ty), 0, 1, -stepSize, stepSize);
    this.y += stepY;
    this.ty += 0.01;
  }
}
