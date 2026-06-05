// Exercise 0.5: A Gaussian Random Walk
//
// A random walk in which the step size (how far the object moves
// in a given direction) is generated with a normal distribution
// rather than being a fixed value.

class Walker {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
  }

    show() {
        stroke(0);
        point(this.x, this.y);
    }

    step() {
        const deviation = 1.5;

        const xstep = randomGaussian(0, deviation);
        const ystep = randomGaussian(0, deviation);

        this.x += xstep;
        this.y += ystep;
    }
}

let walker;

function setup() {
  createCanvas(640, 240);
  background(255);
  walker = new Walker();
}

function draw() {
  walker.step();
  walker.show();
}