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
import { createBalloons } from '@basmilius/sparkle';

const balloons = createBalloons({
    count: 15,
    colors: ['#ff4444', '#4488ff', '#44cc44', '#ffcc00'],
    speed: 1,
    driftAmount: 1,
    scale: 1
});
balloons.mount(canvas).start();
```

### Count

Control the number of balloons:

```typescript
// Few balloons
createBalloons({ count: 5 });

// Party mode
createBalloons({ count: 30 });
```

### Colors

Set custom balloon colors:

```typescript
// Pastel palette
createBalloons({
    colors: ['#ffb3ba', '#bae1ff', '#baffc9', '#ffffba']
});

// Monochrome red
createBalloons({
    colors: ['#ff2222', '#cc0000', '#ff6666']
});
```

### Size Range

Control the balloon size:

```typescript
// Small balloons
createBalloons({ sizeRange: [15, 25] });

// Large balloons
createBalloons({ sizeRange: [40, 65] });
```

### Drift

Control the horizontal drift:

```typescript
// Minimal drift
createBalloons({ driftAmount: 0.3 });

// Strong sideways movement
createBalloons({ driftAmount: 2 });
```
