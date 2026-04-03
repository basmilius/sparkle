# Confetti

The confetti simulation creates customizable particle bursts. Unlike the other simulations, confetti does not auto-spawn — you trigger bursts manually using the `burst()` method.

::: render
render=../code/confetti/preview.vue
:::

## Examples

::: example Click to fire || Click anywhere to fire a confetti burst from that position.
example=../code/confetti/preview.vue
:::

::: example Directional bursts || Fire confetti from both sides of the screen simultaneously.
example=../code/confetti/directional.vue
:::

## Color Palettes

Try different color palettes by clicking the buttons below, then click anywhere to fire.

::: example Color palettes || Select a palette and click anywhere to compare the different color styles.
example=../code/confetti/color-palettes.vue
:::

Use a built-in palette:

```typescript
confetti.burst({
    palette: 'warm',
    particles: 120
});
```

Or provide custom colors to override the palette:

```typescript
confetti.burst({
    colors: ['#ff0000', '#00ff00', '#0000ff'],
    particles: 120
});
```

Available palettes: `classic`, `pastel`, `vibrant` (default), `warm`.

## Custom Shapes

Choose which particle shapes to use:

```typescript
confetti.burst({
    angle: 90,
    spread: 60,
    particles: 100,
    startVelocity: 45,
    shapes: ['star', 'circle'],
    x: 0.5,
    y: 0.5
});
```

Available shapes: `bowtie`, `circle`, `crescent`, `diamond`, `heart`, `hexagon`, `ribbon`, `ring`, `square`, `star`, `triangle`.

## Physics Tuning

Adjust gravity and decay for different feels:

```typescript
// Slow, floaty confetti
confetti.burst({
    angle: 90,
    spread: 90,
    particles: 200,
    startVelocity: 30,
    gravity: 0.5,
    decay: 0.95,
    ticks: 400,
    x: 0.5,
    y: 0.5
});
```

```typescript
// Fast, explosive confetti
confetti.burst({
    angle: 90,
    spread: 120,
    particles: 250,
    startVelocity: 70,
    gravity: 2,
    decay: 0.85,
    ticks: 100,
    x: 0.5,
    y: 0.5
});
```
