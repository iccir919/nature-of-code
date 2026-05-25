# Exercise 0.1 — Walker Tends Down and Right

## Prompt

Create a random walker that has a tendency to move down and to the right.

## Approach

I started from Example 0.1's walker, where each of the four directions had an equal 25% chance of being selected on every step:

```js
step() {
  let choice = floor(random(4));
  if (choice === 0) {
    this.x++;
  } else if (choice === 1) {
    this.x--;
  } else if (choice === 2) {
    this.y++;
  } else {
    this.y--;
  }
}
```

To bias the walker toward the bottom-right, I needed to weight the probabilities so that moving right (`x++`) and moving down (`y++`) were chosen more often than moving left or up.

My first attempt gave right and down each a 40% chance. That turned out to be too heavy a bias — the trail looked like a messy diagonal line with very little wandering, which wasn't visually interesting.

## Result

I lowered the bias: 30% chance each for right and down, 20% chance each for left and up. This produced the effect I was looking for — up close, the walker still feels genuinely random, but zoomed out you can clearly see it drifting toward the bottom-right corner of the canvas. The local randomness and the global tendency coexist nicely.