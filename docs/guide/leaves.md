# Leaves

The leaves simulation creates falling autumn leaves that tumble and drift in the wind. Each leaf is uniquely shaped — ovals, maple leaves, and pointed leaves — in warm autumn colors, with realistic 3D flip rotation.

::: render
render=../code/leaves/preview.vue
:::

## Examples

::: example Autumn breeze || Gently falling leaves with default settings.
example=../code/leaves/preview.vue
:::

::: example Windy day || Dense leaves blowing sideways in strong wind.
example=../code/leaves/windy.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createLeaves } from '@basmilius/sparkle';

const leaves = createLeaves({
    count: 80,
    colors: ['#c0392b', '#e74c3c', '#d35400', '#e67e22', '#f39c12'],
    size: 14,
    speed: 1,
    wind: 0.3,
    scale: 1
});
leaves.mount(canvas).start();
```

### Count

Control the number of leaves:

```typescript
// Sparse
createLeaves({ count: 30 });

// Dense canopy
createLeaves({ count: 200 });
```

### Wind

Control the horizontal wind strength and direction:

```typescript
// Calm, mostly falling straight down
createLeaves({ wind: 0 });

// Strong wind blowing right
createLeaves({ wind: 0.8 });

// Wind blowing left
createLeaves({ wind: -0.5 });
```

### Colors

Customize the autumn palette:

```typescript
// Golden theme
createLeaves({
    colors: ['#f1c40f', '#f39c12', '#d4a017']
});

// Red maple theme
createLeaves({
    colors: ['#c0392b', '#e74c3c', '#a0522d']
});
```

### Speed

```typescript
// Slow, peaceful drift
createLeaves({speed: 0.5});

// Fast autumn storm
createLeaves({speed: 2});
```
