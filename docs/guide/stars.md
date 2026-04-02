# Stars

The stars simulation combines a twinkling starry sky with occasional shooting stars. Stars pulse gently with individual rhythms, while shooting stars streak across the canvas with luminous trails. Use it in sky mode, shooting mode, or both combined.

::: render
render=../code/stars/preview.vue
:::

## Examples

::: example Combined || Twinkling stars with shooting stars.
example=../code/stars/preview.vue
:::

::: example Shooting stars || Frequent shooting stars with long trails.
example=../code/stars/shooting.vue
:::

::: example Starry sky || Dense twinkling sky without shooting stars.
example=../code/stars/sky.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { StarSimulation } from '@basmilius/sparkle';

const sim = new StarSimulation(canvas, {
    mode: 'both',
    starCount: 150,
    shootingInterval: [120, 360],
    twinkleSpeed: 1,
    scale: 1
});
sim.start();
```

### Mode

Choose which layers to display:

```typescript
// Only twinkling stars
new StarSimulation(canvas, { mode: 'sky' });

// Only shooting stars
new StarSimulation(canvas, { mode: 'shooting' });

// Both combined
new StarSimulation(canvas, { mode: 'both' });
```

### Star Count

Control the density of background stars:

```typescript
// Sparse sky
new StarSimulation(canvas, { starCount: 50 });

// Dense starfield
new StarSimulation(canvas, { starCount: 300 });
```

### Shooting Interval

Control how often shooting stars appear (in ticks):

```typescript
// Frequent shooting stars
new StarSimulation(canvas, { shootingInterval: [30, 90] });

// Rare shooting stars
new StarSimulation(canvas, { shootingInterval: [300, 600] });
```

### Twinkle Speed

```typescript
// Slow, gentle twinkle
new StarSimulation(canvas, { twinkleSpeed: 0.5 });

// Fast, flickering stars
new StarSimulation(canvas, { twinkleSpeed: 2.5 });
```
