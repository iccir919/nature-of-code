# Exercise 0.10 — Noise as Elevation

## Prompt

Use the noise values as the elevations of a landscape.

## The reaction

This exercise was a huge leap from everything before it. When I first looked at Shiffman's example code (a `Terrain` class with `calculate()`/`render()` methods, a 2D array of z-values, QUAD_STRIPs, push/pop with rotations) I genuinely thought "I understand nothing." Up until this point the chapter had been about randomness, and suddenly the exercise needed me to also understand 3D rendering, mesh construction, classes, and camera transformations.

The trick that made it tractable was building it from scratch in stages, where each stage added exactly one new concept. By Stage 4 I was looking at Shiffman's code and could read every line.

## Stage 1 — Get a 3D canvas working

`createCanvas(640, 400, WEBGL)` with the WEBGL flag puts p5 in 3D mode. The origin is at the *center* of the canvas, not the top-left. Drawing `plane(200, 200)` confirmed 3D was working. Adding `rotateX(PI / 4)` tilted the plane and made the 3D-ness visible.

## Stage 2 — Build a mesh by hand

The biggest conceptual stage. Replaced the magical `plane()` call with manual vertex placement.

**Stage 2a** — One quad, hand-built with `beginShape() ... vertex(x, y, z) ... endShape(CLOSE)`. Confirmed that I control every vertex by changing one z-value and seeing the corner pop up out of the plane.

**Stage 2b** — Multiple connected quads with `QUAD_STRIP`. Listing vertices in zig-zag pairs lets each new pair form a quad with the previous pair, no duplicates. Vertices are the "fence posts"; quads are the "fence panels between posts."

**Stage 2c** — A full grid using nested loops. Outer loop = one QUAD_STRIP per column-pair (vertical strips standing side by side). Inner loop = walking down each strip, adding pairs of vertices. Tried replacing flat z=0 with `random()` heights and got "crumpled paper" — every vertex independent, no correlation between neighbors.

## Stage 3 — Heights from Perlin noise

The smallest code change of the journey. Replaced the hard-coded `0` in each `vertex()` call with `map(noise(xoff, yoff), 0, 1, -80, 80)`, advancing `xoff` and `yoff` per loop iteration just like Exercise 0.8.

The result was instantly recognizable as **terrain**. Crumple became hills. Because adjacent vertices sample nearby points in the noise field, they have similar heights, and the surface looks smooth. This was the moment I really understood why Perlin noise is *the* tool for natural-looking generated content: smoothness over small input changes turns chaos into landscapes.

## Stage 4 — Refactor into a class with animation

Wrapped everything in a `Terrain` class:
- Constructor stores `scl` (cell size), `w`/`h` (total dimensions), `cols`/`rows` (derived counts), `z` (a 2D array of cached heights), and `zoff` (the noise time dimension).
- `calculate()` fills the `z` array by sampling `noise(xoff, yoff, zoff)` at each grid point, then increments `zoff` so the terrain morphs over time.
- `render()` walks the `z` array and draws QUAD_STRIPs, reading cached heights.

Added camera transformations in `draw()`:
- `translate(0, 20, -200)` pushes the scene back and slightly down.
- `rotateX(PI / 3)` tilts so we look down at the terrain.
- `rotateZ(theta)` slowly rotates around the vertical axis.
- `push()`/`pop()` save and restore canvas state so transformations don't accumulate across frames.

After Stage 4, Shiffman's code was no longer opaque. Every part of it mapped to something I'd written myself.

## My tweaks

After getting the canonical version running, I made two changes:

1. **Asymmetric noise increments.** Kept `yoff += 0.1` but changed `xoff += 0.05` (half the original). This makes adjacent columns sample more correlated noise values than adjacent rows do, which gives the terrain *longer, smoother ridges* in the x-direction. Combined with the rotation, the result feels less choppy and more "geological" — the landscape evolves slowly as it spins.

2. **Green/blue elevation coloring.** Replaced the default grayscale shading with:
   ```js
   fill(30, shade, 255 - shade);
   ```
   Green channel rises with elevation; blue channel inversely falls. The 30 in red is just enough warmth to keep it from being neon. Low areas read as deep blue (water/shadow), high areas as green (land/peaks), with a smooth gradient between. The inverse relationship between green and blue is what makes the *hue* shift with elevation, not just the brightness.

## Result

A continuously morphing green-and-blue landscape, slowly spinning like a globe. Watching it for a minute feels meditative — ridges form, rotate into view, evolve into valleys, smooth out, give way to new peaks. The fact that it's all driven by a single 3D noise field (x, y, time) makes the visual coherence feel almost magical.

## Things I'd try next

- Apply the ocean-wave trick from 0.8: at low elevations, snap to dark blue with no gradient; at high elevations, use the smooth green ramp. Creates a sharp water/land boundary.
- Add a second `calculate` pass with `noiseDetail(8, 0.7)` and *add* the fine-detail heights to the broad ones for jagged peaks layered on smooth foothills.

## Takeaway

The biggest meta-lesson of this exercise wasn't about noise or 3D — it was about *how to approach overwhelming code*. When Shiffman's solution first appeared, it felt impenetrable. Breaking it into stages where each stage added exactly one new concept (3D canvas, then vertex placement, then strip primitive, then nested loops, then noise heights, then class refactor) made every step manageable. Each stage stood on the previous one. By the end, the full solution wasn't a wall of code — it was a stack of things I'd already understood.

This is generalizable. Whenever I encounter a piece of code that feels like too much at once, the move is to find the simplest possible thing that uses one of the techniques, build that, then layer on the next technique. Don't try to read complex code top-to-bottom; rebuild it bottom-up.

The other big lesson: Perlin noise scales naturally from 1D (Exercise 0.6's walker) to 2D (Exercise 0.7's cloud) to 3D (Exercise 0.9's animation) to 3D-with-time (this exercise's morphing terrain). Same function, same math, same smoothness property — just applied with one more argument each time. The same idea that gave a single walker momentum gave an entire landscape continuity.