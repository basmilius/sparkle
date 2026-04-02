# Streamers

The streamers simulation creates colorful party ribbons that fall and curl through the air. Each streamer follows a wavy path with organic swaying motion, creating a festive celebration effect.

::: render
render=../code/streamers/preview.vue
:::

## Examples

::: example Default || Colorful streamers gently falling with curling motion.
example=../code/streamers/preview.vue
:::

::: example Party || Dense streamers falling faster for a lively party atmosphere.
example=../code/streamers/party.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { StreamerSimulation } from '@basmilius/sparkle';

const sim = new StreamerSimulation(canvas, {
    count: 30,
    speed: 1.2,
    scale: 1
});
sim.start();
```

### Count

Control the number of streamers on screen:

```typescript
// Sparse streamers
new StreamerSimulation(canvas, { count: 10 });

// Dense party effect
new StreamerSimulation(canvas, { count: 40 });
```

### Speed

Adjust how fast the streamers fall:

```typescript
// Slow, gentle falling
new StreamerSimulation(canvas, { speed: 0.5 });

// Fast, energetic falling
new StreamerSimulation(canvas, { speed: 2 });
```

### Colors

Provide custom colors for the streamers:

```typescript
// Gold and silver theme
new StreamerSimulation(canvas, {
    colors: ['#ffd700', '#c0c0c0', '#fffacd', '#e8e8e8']
});

// Monochrome blue
new StreamerSimulation(canvas, {
    colors: ['#1e90ff', '#4169e1', '#6495ed', '#87ceeb']
});
```
