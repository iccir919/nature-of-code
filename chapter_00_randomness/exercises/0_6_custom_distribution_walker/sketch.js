// Exercise 0.6: A Walker with a Custom Distribution for Step Size
//
// Use a custom probability distribution (accept-reject) to vary the
// size of each step. Map the probability to a quadratic function so
// the likelihood of a value being picked equals the value squared.

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
    // A uniform distribution of random step sizes. Change this!
    let step = 2;
    let stepx = acceptReject() * step;
    stepx *= random() < 0.5 ? -1 : 1;
    let stepy = acceptReject() * step;
    stepy *= random() < 0.5 ? -1 : 1; 
    this.x += stepx;
    this.y += stepy;
  }
}

function acceptReject() {
    while (true) {
        const r1 = random(1);
        const probability = r1 * r1; 
        const r2 = random(1);
        if (r2 < probability) {
            return r1;
        }
    }
}

function levyMagnitude() {
  // Returns a value from 0 to 1, biased toward 0 (small values).
  while (true) {
    const r1 = random(1);
    const probability = 1 - r1;   // High r1 = low probability of acceptance
    const r2 = random(1);
    if (r2 < probability) {
      return r1;
    }
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