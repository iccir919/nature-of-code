# Exercise 0.6 — Walker with a Custom Distribution for Step Size

## Prompt

Use a custom probability distribution to vary the size of the random walker's steps. The step size can be determined by influencing the range of values picked with a qualifying random value. Can you map the probability to a quadratic function by making the likelihood that a value is picked equal to the value squared?

## Approach

I adapted the accept-reject algorithm from Example 0.5 to produce a step magnitude, then used a separate random sign flip to give the walker bidirectional movement on each axis:

```js
step() {
  const step = 1.5;

  let stepx = acceptReject() * step;
  stepx *= random() < 0.5 ? -1 : 1;

  let stepy = acceptReject() * step;
  stepy *= random() < 0.5 ? -1 : 1;

  this.x += stepx;
  this.y += stepy;
}

function acceptReject() {
  while (true) {
    const r1 = random(1);
    const probability = r1 * r1;  // Quadratic, as the prompt asks for
    const r2 = random(1);
    if (r2 < probability) {
      return r1;
    }
  }
}
```

Two things made this design work:

- `acceptReject()` only returns values from 0 to 1, so it can produce a *magnitude* but not a *direction*. I generated the sign separately with `random() < 0.5 ? -1 : 1` for each axis. This is a common pattern when a distribution is one-sided but you need bidirectional output.
- The quadratic probability (`r1 * r1`) skews accepted values toward 1, so step magnitudes cluster closer to the max (`step = 2` pixels) than to 0.

## Result

Compared to my Gaussian walker, the steps here are more consistently medium-to-large rather than mostly small with occasional bigger ones. The walker covers ground faster, and the path feels less like wandering and more like striding.

The visual difference is actually pretty subtle in the walker itself — what convinced me the distribution was really skewed was visualizing it as a histogram (Example 0.2 style) using `acceptReject()` instead of `random()` as the bucket picker. The bars sloped clearly upward to the right, and the slope steepened noticeably when I changed `r1` to `r1 * r1`. The histogram is where the *shape* of the distribution lives; the walker is just one consumer of values from it.

## Side exploration: Lévy flight

After getting the quadratic version working, I wanted to see the opposite skew — a distribution biased toward small values with rare large jumps, which is what real foraging animals (bees, sharks, albatrosses) actually do. I inverted the probability and increased the scale:

```js
const probability = 1 - r1;  // High r1 = low probability
// ...with maxStep = 100
```

The result was striking: the walker hovered in small clusters of dense dots, then occasionally snapped to a new region of the canvas and started clustering there. That "explore locally, jump globally" pattern is a Lévy flight.

It also made the difference between **distribution shape** and **distribution scale** concrete. `probability = 1 - r1` controls the *shape*, `maxStep = 100` controls the *scale*. Two independent knobs.

## Things I'd try next

- Cubic or higher exponents (`r1 * r1 * r1`) for an even sharper bias toward the maximum step size.
- A side-by-side comparison page running four walkers at once: uniform, Gaussian, accept-reject quadratic, and Lévy flight. Seeing all four next to each other would make the personality of each distribution obvious.
- A slider that lets me morph the exponent live and watch the walker's character change in real time.

## Takeaway

The accept-reject algorithm is a general tool for shaping distributions. Once the structure is in place, you can implement any distribution you can describe with a probability function — linear, quadratic, inverted, anything. The walker's behavior is downstream of that choice.

The bigger lesson from this exercise: when a sketch consumes random values, the *shape* of the distribution the values are drawn from is the most powerful knob you can tune. It changes the character of the entire sketch without changing a single line of the walker logic itself.