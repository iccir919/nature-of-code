# Exercise 0.9 — Animated 2D Noise

## Prompt

Add a third argument to `noise()` that increments once per cycle through `draw()` to animate the 2D noise.

## Approach

Two small structural changes turned the static Example 0.7 sketch into an animation:

1. **Moved the pixel loop from `setup()` into `draw()`** so it re-runs every frame instead of running once.
2. **Added a time variable `t` declared outside `draw()`** so it persists across frames, and incremented it at the end of each cycle.

```js
let t = 0.0;

function setup() {
  createCanvas(640, 240);
}

function draw() {
  loadPixels();
  // pixel loop reads noise(xoff, yoff, t)
  // ...
  updatePixels();
  t += 0.01;
}
```

Each pixel still samples the same `(xoff, yoff)` position it always did, but now noise takes a third argument — the time dimension. Each frame, `t` advances, so we're sampling a slightly different *slice* of the noise field. The 2D image stays in place spatially, but the underlying values morph as we move through the noise field's third dimension.

Important: `t` has to be declared *outside* `draw()`. If I'd put `let t = 0` inside `draw()`, it would reset to 0 every frame and the animation wouldn't work.

## Color extension

Once the animation was running in grayscale, I wanted color. After exploring a few options (single-channel blue, HSB hue from noise, etc.), I landed on the most striking one: three **independent noise samples** per pixel, one for each RGB channel, each reading from a different region of the noise field.

```js
const r = noise(xoff,         yoff,         t) * 255;
const g = noise(xoff + 1000,  yoff + 1000,  t) * 255;
const b = noise(xoff + 2000,  yoff + 2000,  t) * 255;

set(x, y, color(r, g, b));
```

The `+ 1000` and `+ 2000` offsets mean each channel samples a completely different part of the noise space. All three share the same time `t`, so they morph at the same *rate*, but they're reading from decorrelated regions and therefore vary independently. The visual result is a constantly shifting field where reds, greens, and blues swirl through one another like an oil slick.

## Result

The final sketch looks almost meditative — soft, slow flowing color fields that morph indefinitely. Sometimes a region drifts into deep red, then transitions through purple as blue rises, then green emerges and turns it teal. The motion never repeats because the underlying noise field is infinite.

I also tuned two parameters for the final aesthetic:

- `noiseDetail(5, 0.5)` — 5 octaves with default falloff. Slightly less detail than 0.8's setting, which gives a softer, less busy feel.
- Increments dropped from `0.01` to `0.005` per pixel. Bigger features, slower variation across the canvas.

## Performance note

This version makes three `noise()` calls per pixel, so ~460,000 noise calls per frame for a 640×240 canvas. It runs slower than the grayscale animation. If the framerate drops noticeably, dropping the canvas to `createCanvas(320, 120)` (a quarter of the pixels) brings it back to smooth.

## Final settings

```js
let t = 0.0;

function setup() {
  createCanvas(640, 240);
  noiseDetail(5, 0.5);
}

function draw() {
  loadPixels();
  let xoff = 0.0;
  for (let x = 0; x < width; x++) {
    let yoff = 0.0;
    for (let y = 0; y < height; y++) {
      const r = noise(xoff,         yoff,         t) * 255;
      const g = noise(xoff + 1000,  yoff + 1000,  t) * 255;
      const b = noise(xoff + 2000,  yoff + 2000,  t) * 255;

      set(x, y, color(r, g, b));

      yoff += 0.005;
    }
    xoff += 0.005;
  }
  updatePixels();
  t += 0.01;
}
```

## Things I'd try next

- Apply the ocean wave non-linear color mapping from 0.8 to this animated version — animated foam crests on a dark sea.
- Use different `t` increment rates for each channel, so the red field morphs faster than the blue.
- Combine with the asymmetric increment idea — animated *and* directional, for an unsettling kinetic effect.

## Takeaway

The "third dimension" of noise turns out to be the easiest way to animate anything in this entire chapter. No state machine, no separate animation loop — just one extra argument to `noise()` and a variable that advances over time. The 2D field already had the answer baked in; we just needed to take one step along an axis that was always there.

The color extension also reinforced the lesson from 0.8: noise gives you a number, and what you *do* with that number is where the visual identity comes from. Three independent noise streams driving three color channels created an effect that none of the single-channel versions could have achieved, but the underlying noise calculations are exactly the same as the grayscale version.