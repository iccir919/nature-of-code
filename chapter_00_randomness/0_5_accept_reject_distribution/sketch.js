// Nature of Code - Example 0.5: An Accept-Reject Distribution
//
// Implements a Monte Carlo "accept-reject" algorithm to produce a
// non-uniform distribution where higher values are more likely to be
// picked than lower ones. The distribution follows y = x: a value's
// probability of being accepted equals the value itself.
//

let randomCounts = [];
const totalBuckets = 20;

function setup() {
  createCanvas(640, 240);
  for (let i = 0; i < totalBuckets; i++) {
    randomCounts[i] = 0;
  }
}

function draw() {

  // Pick a bucket using accept-reject instead of plain random
  const index = floor(acceptReject() * randomCounts.length);
  randomCounts[index]++;

  stroke(0);
  fill(127);
  const w = width / randomCounts.length;
  for (let x = 0; x < randomCounts.length; x++) {
    rect(x * w, height - randomCounts[x], w - 1, randomCounts[x]);
  }
}

// Accept-reject algorithm: returns a value from 0 to 1, with higher
// values more likely than lower ones (probability = value).
function acceptReject() {
  while (true) {
    const r1 = random(1);        // Candidate value
    const probability = r1;       // Its acceptance probability is itself
    const r2 = random(1);         // A second random "qualifier"
    if (r2 < probability) {
      return r1;                  // Accept it
    }
    // Otherwise loop and try again
  }
}