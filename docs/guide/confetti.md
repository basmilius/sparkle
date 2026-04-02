# Confetti

The confetti simulation creates customizable particle bursts. Unlike the other simulations, confetti does not auto-spawn — you trigger bursts manually using the `fire()` method.

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

## Custom Colors

Override the default color palette:

```typescript
sim.fire({
    angle: 90,
    spread: 70,
    particles: 120,
    startVelocity: 40,
    colors: ['#ff0000', '#00ff00', '#0000ff'],
    x: 0.5,
    y: 0.5
});
```

## Custom Shapes

Choose which particle shapes to use:

```typescript
sim.fire({
    angle: 90,
    spread: 60,
    particles: 100,
    startVelocity: 45,
    shapes: ['star', 'circle'],
    x: 0.5,
    y: 0.5
});
```

Available shapes: `circle`, `diamond`, `ribbon`, `square`, `star`, `triangle`.

## Physics Tuning

Adjust gravity and decay for different feels:

```typescript
// Slow, floaty confetti
sim.fire({
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
sim.fire({
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
