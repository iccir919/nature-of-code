# Exercise 0.5 — Gaussian Random Walker

## Prompt

A Gaussian random walk is defined as one in which the step size (how far the object moves in a given direction) is generated with a normal distribution. Implement this variation of the Walker class.

## Approach

In Example 0.1, the walker moved exactly 1 pixel per frame along one of four cardinal directions, chosen uniformly. Here, both direction and magnitude come from a Gaussian distribution centered on 0:

```js
step() {
  const deviation = 1.5;

  const xstep = randomGaussian(0, deviation);
  const ystep = randomGaussian(0, deviation);

  this.x += xstep;
  this.y += ystep;
}
```

I settled on a standard deviation of 1.5 after experimenting with a few values. Higher SDs (around 3 to 5) made the walker move too fast to feel like wandering — it looked more like teleporting. Lower SDs (under 1) felt timid, barely distinguishable from the original uniform walker. 1.5 hit a sweet spot where the walk has visible momentum but still reads as wandering, with the occasional larger jump that gives it organic character.

Because the Gaussian is centered on 0 and symmetric, a single call returns both direction (positive or negative) and magnitude in one number. The walker no longer needs separate logic for "which way" and "how far."

Using two independent Gaussians (one per axis) means each frame can produce an asymmetric step, like a tiny vertical move paired with a larger horizontal one. That per-frame asymmetry contributes to the organic feel of the walk.

## Result

Compared to Example 0.1, the Gaussian walker has a noticeably more natural quality. Most steps are small (Gaussian values cluster near the mean of 0), but occasionally a step lands 4 or 5 pixels out, which produces a mix of fine wandering punctuated by bigger jumps. That distribution of magnitudes is what makes it feel like real motion rather than grid-locked jitter.

## Exploration: edge behavior

I wondered whether to constrain the walker to stay on the canvas. Without any constraint, the walker can wander off and stop being visible (p5.js silently clips points outside the canvas).

I tried implementing a wrap-around using modulo, so the walker would exit one side and reappear on the other:

```js
this.x = (this.x + width) % width;
this.y = (this.y + height) % height;
```

The `+ width` is needed because JavaScript's `%` preserves the sign of the dividend, so negative values would otherwise stay negative.

Visually, though, wrap-around was disorienting. The walker teleported across the canvas with no warning, the trail broke into disconnected segments, and I kept losing track of where the dot was.

I considered clamping (walker pins to the edge) and respawn-at-center, but ultimately decided to keep the unconstrained original. The exercise is about Gaussian step size, and adding edge behavior introduces extra mechanics that distract from what's being demonstrated. If the walker drifts off-screen, that's the honest behavior of an unconstrained Gaussian walk.

## Things I'd try next

- Slider to adjust the standard deviation live, so I can see in real time how step size affects the character of the walk.
- Non-zero mean for `xstep` or `ystep` to add directional drift, like a slow current pulling the walker right.
- Draw `line(prevX, prevY, this.x, this.y)` between consecutive positions instead of `point()`, so the trajectory shows continuous lines instead of a series of dots. Especially nice with larger SDs.
- Multiple walkers in different colors all starting at center, to see how Gaussian walks diverge from a common origin.

## Takeaway

A Gaussian-driven step replaces both the "direction" and "step size" concerns of a traditional random walk with a single distribution. The asymmetry it produces (small most of the time, occasionally larger) is the same kind of variety that made the paint splatter feel alive — randomness *with structure* reads more organic than uniform randomness.

The edge-behavior exploration also reminded me that not every "improvement" is an improvement. Sometimes the cleanest version is the one that does exactly what the exercise asks and nothing more.