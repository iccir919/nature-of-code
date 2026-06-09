# Exercise 0.7 — Random Walker with Perlin Noise Step Size

## Prompt

In the Perlin noise random walker, the result of the `noise()` function is mapped directly to the walker's position. Create a random walker, but map the result of the `noise()` function to the walker's step size instead.

## Approach

My first version picked **one axis per frame** to step on, using `random(2)` to choose between x and y. The step magnitude itself came from `noise()` mapped onto a symmetric range:

```js
step() {
  const choice = floor(random(2));
  const stepSize = 1.5;
  if (choice == 0) {
    let stepX = map(noise(this.tx), 0, 1, -stepSize, stepSize);
    this.x += stepX;
    this.tx += 0.01;
  } else if (choice == 1) {
    let stepY = map(noise(this.ty), 0, 1, -stepSize, stepSize);
    this.y += stepY;
    this.ty += 0.01;
  }
}
```

The idea of mapping noise from `[0, 1]` to `[-stepSize, stepSize]` was deliberate — since noise is smooth, the *direction* of motion would itself transition smoothly. When the noise value drifts toward 1, the walker pushes hard in the positive direction; when noise drifts toward 0, it pushes negative; when noise hovers near 0.5, the walker barely moves. The direction-changes happen organically as the noise curve evolves, rather than from random sign flips.

This worked, but the line it produced was thin and not very interesting. The walker had clear movement, but a lot of the canvas activity was concentrated on just one axis at a time. It didn't feel like Perlin noise was really expressing itself.

## Refining: both axes every frame

I switched to stepping both axes every frame instead of picking one:

```js
step() {
  const stepSize = 1.5;

  let stepX = map(noise(this.tx), 0, 1, -stepSize, stepSize);
  this.x += stepX;
  this.tx += 0.01;

  let stepY = map(noise(this.ty), 0, 1, -stepSize, stepSize);
  this.y += stepY;
  this.ty += 0.01;
}
```

This was the change that made the noise really visible. With both axes moving continuously, the walker traces flowing, curved paths instead of staircase-like single-axis stretches. The smoothness of the noise curve shows up in *both dimensions at once*, which is how Perlin noise really wants to be experienced. Curves became arcs; arcs became loops.

I also initialized the noise offsets with `random(1000)` for each axis, so every run of the sketch starts at a different point on the noise curve. Each refresh produces a unique walk rather than the same trajectory every time.

```js
constructor() {
  this.x = width / 2;
  this.y = height / 2;
  this.tx = random(1000);
  this.ty = random(1000);
}
```

## Result

The walker drifts in long sweeping curves, gradually changes direction, occasionally loops back on itself. Unlike the Gaussian and accept-reject walkers, which look "twitchy with bias," this one has **momentum** — it commits to a direction for a while and then smoothly transitions.

Watching it for a minute felt qualitatively different from any earlier walker. The earlier walkers looked like randomness *applied to a position*. This one looks like the walker has intention, or at least inertia.

## The "drift" question

Early on I thought there was a bug because the walker seemed to always go right. It wasn't a bug. The reason: noise values change *slowly*. When `noise(this.tx)` is sitting around 0.7 for several frames in a row, the mapped step is consistently around +0.6. The walker drifts right. Eventually the noise curve evolves toward 0.3 and the walker drifts left. Each "drift period" can last quite a while, so a short observation window can make it look biased when it isn't.

That smooth correlation is the defining property of Perlin noise. The drift isn't an artifact — it's the entire point.

## Things I'd try next

- Draw `line(prevX, prevY, x, y)` between consecutive positions instead of `point()`. With noise-driven motion, lines reveal the curves much better than scattered dots do.
- Different increment rates for `tx` and `ty` (e.g. `tx += 0.01, ty += 0.03`) to break the symmetry between axes.
- Modulate `stepSize` itself with a third noise stream, so the walker speeds up and slows down over time.
- Multiple noise-driven walkers starting from random positions, all drifting in their own private noise streams.

## Takeaway

The biggest discovery here was that **stepping both axes every frame** is what lets Perlin noise actually show off. With only one axis advancing at a time, the visual reduces to staircases that don't really communicate the smoothness of the underlying algorithm. With both axes moving continuously, the curves emerge and the noise function gets to do what it does best.

More broadly: Perlin noise is the first source of randomness in this chapter that has **memory**. Every prior distribution (uniform, Gaussian, accept-reject) was memoryless — each call was independent. Noise is correlated across calls, which means a noise-driven walker accumulates direction the same way a real object accumulates momentum. That difference is why noise feels organic and the others feel jittery.