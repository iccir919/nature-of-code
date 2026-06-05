// Exercise 0.4: Paint Splatter
//
// Build a paint splatter where most dots cluster around a central
// point but some scatter out to the edges. Use a normal distribution
// for BOTH the position of each dot and its color. Add a slider that
// adjusts the standard deviation in real time.

let stdDevSlider;

function setup() {
  createCanvas(640, 400);
  background(255);

  // Slider for standard deviation. Range here is a starting suggestion.
  stdDevSlider = createSlider(0, 5, 1, 0.1);
  stdDevSlider.position(10, height + 10);
}

function draw() {
    const spread = stdDevSlider.value();

    // Base standard deviations
    const posBaseSD = 40;
    const colorBaseSD = 25
    const sizeBaseSD = 10;

    const x = randomGaussian(width / 2, posBaseSD * spread);
    const y = randomGaussian(height / 2, posBaseSD * spread);

    const r = constrain(randomGaussian(30, colorBaseSD * spread), 0, 255);
    const g = constrain(randomGaussian(30, colorBaseSD * spread), 0, 255);
    const b = constrain(randomGaussian(180, colorBaseSD * spread), 0, 255);

    const size = randomGaussian(13, sizeBaseSD * spread);

    noStroke();
    fill(r, g, b, 80); // Semi-transparent
    circle(x, y, size);

}