# Exercise 0.2 — Probability of Drawing Two Aces in a Row

## Prompt

What is the probability of drawing two aces in a row from a deck of 52 cards, if you reshuffle your first draw back into the deck before making your second draw? What would that probability be if you didn't reshuffle after your first draw?

## Setup

A standard deck has 52 cards, 4 of which are aces.

## With reshuffle (independent events)

The probability of drawing an ace on a single draw is:

```
4 / 52 ≈ 0.077, or about 7.7%
```

If the first card is reshuffled back into the deck, the second draw faces the exact same deck — so the probability of drawing an ace is still 4/52. The two draws are **independent events**.

To find the probability of both events happening, multiply the individual probabilities:

```
(4 / 52) × (4 / 52) = 16 / 2704 ≈ 0.0059, or about 0.59%
```

## Without reshuffle (dependent events)

Without reshuffling, the second draw happens against a different deck: 51 cards total, with only 3 aces left (assuming the first draw was an ace). The second probability now *depends* on what happened first.

```
(4 / 52) × (3 / 51) = 12 / 2652 ≈ 0.0045, or about 0.45%
```

The probability is noticeably lower than the reshuffled case — removing an ace from the pool makes it harder to draw a second one.

## Why this matters for randomness

This exercise illustrates the difference between **sampling with replacement** and **sampling without replacement**. When events are independent, past draws don't influence future ones, and probabilities stay constant. When events are dependent, the state of the system changes after each draw, and the probabilities shift accordingly.

In simulations, this distinction matters: calling `random()` repeatedly is sampling with replacement — every call is independent. Modeling something like dealing a hand of cards, drawing names from a hat, or picking unique items from a set requires sampling without replacement, which means tracking what's already been used and updating the available pool each time.