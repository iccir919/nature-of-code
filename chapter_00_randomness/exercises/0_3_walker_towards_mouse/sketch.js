// Exercise 0.3: Create a random walker with dynamic probabilities.
// For example, give it a 50% chance of moving in the direction of the mouse.

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
        const r = random(1);

        if (r < 0.5) {
        // Move toward the mouse on ONE randomly chosen axis
        if (random(1) < 0.33) {
            this.x += (mouseX > this.x) ? 1 : -1;
        } else {
            this.y += (mouseY > this.y) ? 1 : -1;
        }
        } else {
            // Normal random step (Example 0.1)
            const choice = floor(random(4));
            if (choice === 0) this.x++;
            else if (choice === 1) this.x--;
            else if (choice === 2) this.y++;
            else this.y--;
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