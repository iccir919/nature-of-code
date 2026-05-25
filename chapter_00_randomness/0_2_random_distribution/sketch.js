// Nature of Code - Example 0.2: Random Number Distribution
// Tracks how often random() lands in each of 20 buckets and
// draws a live histogram. Bars should grow at roughly the same rate.

let randomCounts = [];
const totalBuckets = 20;

function setup() {
  createCanvas(640, 240);
  // Initialize each bucket count to 0
  for (let i = 0; i < totalBuckets; i++) {
    randomCounts[i] = 0;
  }
}

function draw() {
  background(255);

  // Pick a random bucket index and increment its count
  const index = floor(random(randomCounts.length));
  randomCounts[index]++;

  // Draw a bar for each bucket
  stroke(0);
  fill(127);
  const w = width / randomCounts.length;
  for (let x = 0; x < randomCounts.length; x++) {
    rect(x * w, height - randomCounts[x], w - 1, randomCounts[x]);
  }
}