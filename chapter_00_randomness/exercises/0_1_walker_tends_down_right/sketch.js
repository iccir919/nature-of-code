// Exercise 0.1: Create a random walker that has a tendency
// to move down and to the right.

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
    
    let choice = floor(random(10));
    if (choice >= 0 && choice <= 2) {
      this.x++;
    } else if (choice === 4 || choice === 5) {
      this.x--;
    } else if (choice >= 6 && choice <= 8) {
      this.y++;
    } else {
      this.y--;
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