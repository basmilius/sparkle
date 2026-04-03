# Balloons

The balloons simulation creates colorful rising balloons with gentle sideways drift and dangling strings. Each balloon has a 3D appearance with gradient shading and a specular highlight.

::: render
render=../code/balloons/preview.vue
:::

## Examples

::: example Basic balloons || Colorful balloons rising gently.
example=../code/balloons/preview.vue
:::

::: example Dense and fast || More balloons rising faster.
example=../code/balloons/dense.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { BalloonSimulation } from '@basmilius/sparkle';

const sim = new BalloonSimulation(canvas, {
    count: 15,
    colors: ['#ff4444', '#4488ff', '#44cc44', '#ffcc00'],
    speed: 1,
    driftAmount: 1,
    scale: 1
});
sim.start();
```

### Count

Control the number of balloons:

```typescript
// Few balloons
new BalloonSimulation(canvas, { count: 5 });

// Party mode
new BalloonSimulation(canvas, { count: 30 });
```

### Colors

Set custom balloon colors:

```typescript
// Pastel palette
new BalloonSimulation(canvas, {
    colors: ['#ffb3ba', '#bae1ff', '#baffc9', '#ffffba']
});

// Monochrome red
new BalloonSimulation(canvas, {
    colors: ['#ff2222', '#cc0000', '#ff6666']
});
```

### Size Range

Control the balloon size:

```typescript
// Small balloons
new BalloonSimulation(canvas, { sizeRange: [15, 25] });

// Large balloons
new BalloonSimulation(canvas, { sizeRange: [40, 65] });
```

### Drift

Control the horizontal drift:

```typescript
// Minimal drift
new BalloonSimulation(canvas, { driftAmount: 0.3 });

// Strong sideways movement
new BalloonSimulation(canvas, { driftAmount: 2 });
```
