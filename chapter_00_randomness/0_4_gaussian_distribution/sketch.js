// Nature of Code - Example 0.4: A Gaussian Distribution
// Draws semi-transparent circles at random x-positions chosen from
// a normal distribution centered on the canvas. Over time, the
// darkest area builds up near the center (the mean), with fainter
// circles trailing off toward the edges (the tails).

function setup() {
  createCanvas(640, 240);
  background(255);
}

function draw() {
  // A normal distribution with mean 320 and standard deviation 60
  const x = randomGaussian(320, 60);

  noStroke();
  fill(0, 10);
  circle(x, 120, 16);
}