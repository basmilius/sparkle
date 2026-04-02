# Donuts

The donut simulation creates floating ring shapes that drift across the canvas, gently bouncing off edges and repelling each other. It's ideal as a decorative background animation.

::: render
render=../code/donuts/preview.vue
:::

## Examples

::: example Floating donuts || Donuts drifting around with collision avoidance.
example=../code/donuts/preview.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { DonutSimulation } from '@basmilius/sparkle';

const sim = new DonutSimulation(canvas, {
    background: '#a51955',
    colors: ['#bd1961', '#da287c'],
    count: 12
});
sim.start();
```

### Scale

Scale all donut sizes, speeds, and collision padding proportionally:

```typescript
// Half-size donuts
new DonutSimulation(canvas, { scale: 0.5 });

// Double-size donuts
new DonutSimulation(canvas, { scale: 2 });
```

### Count

Control the number of donuts on screen:

```typescript
// Sparse background
new DonutSimulation(canvas, { count: 6 });

// Dense background
new DonutSimulation(canvas, { count: 20 });
```

### Colors

Set the fill colors for the donuts. Each donut picks a random color from the array:

```typescript
new DonutSimulation(canvas, {
    colors: ['#6366f1', '#8b5cf6', '#ec4899']
});
```

### Size

Control the donut radius range and ring thickness:

```typescript
// Small, thin rings
new DonutSimulation(canvas, {
    radiusRange: [30, 50],
    thickness: 0.25
});

// Large, thick rings
new DonutSimulation(canvas, {
    radiusRange: [80, 120],
    thickness: 0.5
});
```

### Speed

Adjust movement and rotation speed:

```typescript
// Slow, ambient drift
new DonutSimulation(canvas, {
    speedRange: [0.05, 0.2],
    rotationSpeedRange: [0.0002, 0.001]
});

// Faster movement
new DonutSimulation(canvas, {
    speedRange: [0.5, 1.2],
    rotationSpeedRange: [0.002, 0.005]
});
```

### Collision Behavior

Tune how donuts interact with each other:

```typescript
// Tight packing, soft repulsion
new DonutSimulation(canvas, {
    collisionPadding: 5,
    repulsionStrength: 0.01
});

// Wide spacing, strong repulsion
new DonutSimulation(canvas, {
    collisionPadding: 40,
    repulsionStrength: 0.05
});
```
