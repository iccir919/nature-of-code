# Exercise 0.4 — Paint Splatter

## Prompt

Consider a simulation of paint splatter drawn as a collection of colored dots. Most of the paint clusters around a central position, but some dots splatter out toward the edges. Can you use a normal distribution of random numbers to generate the positions of the dots? Can you also use a normal distribution of random numbers to generate a color palette? Try creating a slider to adjust the standard deviation.

## First version

I started by addressing the two parts of the prompt directly:

- **Position** — two independent Gaussians for x and y, both centered on the canvas center. The slider controlled this standard deviation, so it directly adjusted how far dots spread from the center.
- **Color** — a deep red base (`r=180, g=30, b=30`) with each channel jittered by its own small Gaussian to create a palette of related reds rather than a flat single color. Each channel was wrapped in `constrain(value, 0, 255)` since `randomGaussian()` has no built-in bounds. This color jitter was independent of the slider, with its own fixed standard deviation.
- **Size** — all dots were the same fixed size.

Each dot was drawn with a low alpha (80) so overlapping dots layered naturally, and I deliberately did NOT clear the background in `draw()` so the splatter could accumulate frame after frame.

This worked — the basic painterly cluster was there — but it felt mechanical. Every dot was the same size, so the texture looked too regular to read as real paint.

## Adding Gaussian size

I experimented with adding a Gaussian to the circle radius as well:

```js
const size = randomGaussian(16, 4);
```

This was the moment the sketch came alive. With most dots near 16px but occasional smaller and larger ones mixed in, the splatter immediately started looking like real paint — droplets of varying weight, some big globs, some fine mist. Such a small change but a huge visual difference.

## Making the slider control everything

With three Gaussians driving the sketch (position, color, size), I noticed the slider was only doing one job: adjusting position spread. That felt limiting. Moving the slider only changed how far dots traveled from center, while the color palette and size variation stayed locked.

I refactored the slider to be a **spread multiplier** instead of a raw position SD. Each property got its own base SD tuned to feel right at a multiplier of 1, and the slider scaled all three proportionally:

```js
const spread = stdDevSlider.value();

const posBaseSD = 40;
const colorBaseSD = 20;
const sizeBaseSD = 4;

const x = randomGaussian(width / 2, posBaseSD * spread);
const y = randomGaussian(height / 2, posBaseSD * spread);

const r = constrain(randomGaussian(180, colorBaseSD * spread), 0, 255);
const g = constrain(randomGaussian(30,  colorBaseSD * spread), 0, 255);
const b = constrain(randomGaussian(30,  colorBaseSD * spread), 0, 255);

const size = max(1, randomGaussian(16, sizeBaseSD * spread));
```

The slider range changed from an absolute pixel SD to a dimensionless 0 to 5 (with step 0.1), since it now represents a relative "spread factor" rather than a specific value with units.

## Result

The behavior now feels coherent across the entire slider range:

- `spread = 0` produces a single solid dot of one color and one size at dead center.
- `spread = 1` gives a focused painterly splatter.
- `spread = 5` is chaotic, almost confetti.

What's interesting is that the slider now affects three visually distinct properties at once but the result still feels unified — as you crank it up, the splatter simultaneously spreads, color-shifts, and varies in droplet size, all locked in proportion. It reads as one knob for "intensity," even though it's three Gaussians underneath.

## Takeaway

The biggest visual win came from adding Gaussian *variation* to a property I hadn't initially thought to vary (size). Once a sketch is driven by randomness, the question to keep asking is: what else could be varying here, and would varying it make this feel more alive?

The slider lesson came second: when a single control adjusts multiple Gaussian-driven properties, scaling them through a shared multiplier (with per-property base values) keeps the relationships intentional and turns one knob into a meaningful "intensity" dial.