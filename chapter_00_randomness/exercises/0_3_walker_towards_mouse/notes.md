# Exercise 0.3 — Walker with Dynamic Probabilities

## Prompt

Create a random walker with dynamic probabilities. For example, give it a 50% chance of moving in the direction of the mouse.

## Approach

I used the `random(1)` threshold pattern from Example 0.3 to split the walker's behavior into two branches. With a 50% probability, the walker steps toward the mouse; the other 50% of the time it takes a normal four-direction random step (reusing the logic from Example 0.1).

The "toward the mouse" branch compares the walker's position to `mouseX` / `mouseY` and steps in whichever direction closes the gap on each axis:

```js
if (mouseX > this.x) {
  this.x++;
} else {
  this.x--;
}

if (mouseY > this.y) {
  this.y++;
} else {
  this.y--;
}
```

## Result

My first version worked logically but didn't look random — the walker moved in a fairly direct diagonal beeline toward the cursor instead of wandering.

The cause turned out to be a **speed imbalance between the two branches**, not a bug:

- The toward-mouse branch moved on **both axes at once** (`this.x` and `this.y` both changed), so each of those steps covered a diagonal, two-pixel distance.
- The random branch moved on **only one axis** (a single `floor(random(4))` choice), so just one pixel.

Because the mouse-seeking steps covered twice the distance, they visually dominated the path even though each branch fired equally often. The randomness was there — it was just being out-muscled.

I fixed it by making the toward-mouse branch also pick a single axis per step, so every step is a uniform one-pixel move regardless of which branch fires:

```js
if (r < 0.5) {
  // Move toward the mouse on ONE randomly chosen axis
  if (random(1) < 0.5) {
    this.x += (mouseX > this.x) ? 1 : -1;
  } else {
    this.y += (mouseY > this.y) ? 1 : -1;
  }
} else {
  // Normal random step (Example 0.1)
  const choice = floor(random(4));
  if (choice === 0) this.x++;
  else if (choice === 1) this.x--;
  else if (choice === 2) this.y++;
  else this.y--;
}
```

With this change, the walker visibly wanders while still drifting toward the cursor over time — the blend of purposeful and random movement I was after.

## Things I'd try next

- Lower the mouse probability (e.g. `r < 0.25`) for a walker that wanders more and only occasionally lurches toward the cursor.

## Takeaway

When mixing two kinds of movement, it's not enough to balance *how often* each fires — the *distance covered* per step has to be comparable too, or the longer-stride behavior will dominate the look even at equal probability.