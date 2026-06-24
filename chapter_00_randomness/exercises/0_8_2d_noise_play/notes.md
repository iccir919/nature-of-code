# Exercise 0.8 — Playing with 2D Perlin Noise

## Prompt

Play with color, `noiseDetail()`, and the rate at which `xoff` and `yoff` are incremented to achieve different visual effects.

## Understanding the sketch

Before I could play with anything, I had to figure out what was actually happening in Example 0.7. The thing that initially confused me was the relationship between **pixel position** and **noise input**.

The sketch loops over every pixel on the canvas (640 × 240 = 153,600 pixels). For each one, it samples the noise function — but it doesn't pass the pixel coordinates directly. Instead, two separate variables `xoff` and `yoff` creep up by `0.01` per pixel. So when rendering pixel `(100, 50)`, the sketch is actually asking `noise(1.0, 0.5)`.

Why the indirection? Because `noise()` returns smoothly correlated values *for small input changes*. Calling `noise(100, 50)` directly would jump way too far across the noise landscape — the result would look jagged and random. By advancing only `0.01` per pixel, adjacent pixels sample nearby points on the noise landscape, which is what produces the smooth cloudy texture.

**Mental model:** noise is like a giant misty mountain range. The pixel coordinates tell the sketch *where on the canvas to write down each measurement*. The noise inputs tell the noise function *which spot on the mountain to sample*. Two different coordinate systems.

Once that clicked, the three knobs the prompt mentions made sense:
- **Increment rates** control how big a step I take between noise measurements (small steps = big smooth features, large steps = small chaotic features).
- **`noiseDetail()`** changes what the underlying noise landscape looks like (smooth rolling hills vs. jagged peaks with cracks).
- **Color** changes how I display the noise value, but doesn't affect the noise itself.

## Knob 1: Color

The simplest color change is passing a `color(r, g, b)` to `set()` instead of a single grayscale value. I chose blue, sending the noise value to the blue channel only:

```js
set(x, y, color(0, 0, floor(bright)));
```

Red and green stay at 0, so the result is a black-to-blue gradient across the noise field. Same texture as the original, but blue instead of gray. The noise computation didn't change at all — only the display did.

## Knob 2: noiseDetail()

This one took the longest to wrap my head around. The breakthrough was learning that Perlin noise isn't computed from a single curve — it's built by **adding multiple noise curves (octaves) together**, each with finer detail.

`noiseDetail(octaves, falloff)`:
- **Octaves** = how many layers to include in the mix. Default is 4.
- **Falloff** = how loud each successive layer is relative to the previous. Default is 0.5 (each layer is half as loud as the one before).

The music analogy helped: octaves are like the instruments in a band (more octaves = more instruments). Falloff is the volume mix (low falloff = bass dominates, high falloff = every instrument is loud).

I tried several settings:
- `noiseDetail(1, 0.5)` — only the "bass" layer. Watercolor-soft.
- `noiseDetail(4, 0.5)` — default. The classic Perlin cloud.
- `noiseDetail(8, 0.65)` — many layers, fairly loud. Marbled stone.
- `noiseDetail(8, 0.9)` — many layers, nearly all loud. Almost TV static.

I landed on `noiseDetail(7, 0.6)` — seven octaves with moderate falloff. Detailed but not overwhelming, with visible fine texture layered on top of larger shapes.

## Knob 3: Increment rates

Smaller increments mean adjacent pixels sample nearly-identical noise values, so features look big and soft. Larger increments mean less correlation between neighbors, so features look small and busy.

I bumped both axes from the default `0.01` to `0.02`. The features tightened up a bit — less "lazy cloud," more "fingerprint texture." Paired nicely with the richer `noiseDetail()` setting.

## The trippy asymmetric experiment

The most interesting moment of the exercise. I tried making the x and y increments different:

```js
yoff += 0.01;
xoff += 0.05;
```

The result was visually unsettling in a fascinating way. Because x advanced 5× faster than y, features stretched into tall narrow vertical streaks. The static image looked like it was *moving* — my eyes kept trying to read directional motion into the streaks, but nothing was actually moving. The texture was perfectly still.

This is a real perceptual phenomenon: extreme asymmetric noise creates "fake motion" because human visual systems interpret directional stretching as kinetic blur, the same way camera motion makes stationary objects look streaked.

I didn't keep this for my final version — it was too disorienting to live with — but it was the most memorable thing I tried in the whole exercise.

## Final settings

```js
function setup() {
  createCanvas(640, 240);
  noiseDetail(7, 0.6);

  loadPixels();
  let xoff = 0.0;
  for (let x = 0; x < width; x++) {
    let yoff = 0.0;
    for (let y = 0; y < height; y++) {
      const bright = map(noise(xoff, yoff), 0, 1, 0, 255);
      set(x, y, color(0, 0, floor(bright)));
      yoff += 0.02;
    }
    xoff += 0.02;
  }
  updatePixels();
}
```

A clean blue, detailed-but-not-static texture, with slightly tighter features than the default.

## Extension: ocean wave at night

After finishing the main exercise, I built one extension experiment: mapping the noise value **non-linearly** to color instead of using the linear `map()` from before.

Up until now, every noise value (0 to 1) mapped smoothly across the full color range. With piecewise mapping, I split the range:

```js
if (n < 0.7) {
  // Most pixels — deep dark blue, narrow color range
  r = map(t, 0, 1, 0, 20);
  g = map(t, 0, 1, 5, 30);
  b = map(t, 0, 1, 30, 80);
} else {
  // Only ~30% of pixels — bright "foam," dramatic range
  r = map(t, 0, 1, 20, 255);
  g = map(t, 0, 1, 30, 255);
  b = map(t, 0, 1, 80, 255);
}
```

The result was stunning. Most of the canvas became uniform dark navy, but wherever noise happened to peak, sudden bright white "wave crests" appeared. The visual reads instantly as **ocean at night** — even though it's still exactly the same noise field I'd been working with the whole time. Only the color mapping changed.

This was the most useful conceptual unlock of the exercise: **noise values don't have to be displayed linearly**. The same underlying noise can become brightness, water, terrain elevation, fire, lava, marble — anything — depending on how you transform the 0-to-1 number before deciding what to render. This is exactly how procedural terrain in games works: one noise field, multiple color thresholds turning it into ocean, sand, grass, rock, and snow at different elevations.

## Things I'd try next

- HSB color mode with hue driven by noise, for a rainbow gradient instead of a brightness gradient.
- Two different noise samples (at offset positions) driving R, G, and B independently for genuinely colorful noise.
- More piecewise color schemes: 4 or 5 elevation thresholds for a full procedural-terrain look (deep water → shallow water → sand → grass → rock → snow).

## Takeaway

Perlin noise has three independent dimensions of control — **what the noise landscape looks like** (`noiseDetail`), **how fast you walk across it** (increment rates), and **how you display each sample** (color). These three knobs are completely independent: I can change the color of the same noise field without changing the texture, and I can change the texture without changing the color.

This separation is what makes Perlin noise such a versatile tool. The underlying math stays the same; the creative knobs sit on top.

The ocean-wave extension drove this point home: linear color mapping was hiding most of what noise could do. A simple piecewise threshold transformed the same data into something that read as a completely different image — a real "shape comes from how you display, not from what you compute" moment.

The asymmetric experiment was also a reminder that visual perception isn't neutral — patterns can feel "moving" or "still" in ways that have nothing to do with whether anything is actually changing in the image.