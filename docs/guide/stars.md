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
import { createStars } from '@basmilius/sparkle';

const stars = createStars({
    mode: 'both',
    starCount: 150,
    shootingInterval: [120, 360],
    twinkleSpeed: 1,
    scale: 1
});
stars.mount(canvas).start();
```

### Mode

Choose which layers to display:

```typescript
// Only twinkling stars
createStars({ mode: 'sky' });

// Only shooting stars
createStars({ mode: 'shooting' });

// Both combined
createStars({ mode: 'both' });
```

### Star Count

Control the density of background stars:

```typescript
// Sparse sky
createStars({ starCount: 50 });

// Dense starfield
createStars({ starCount: 300 });
```

### Shooting Interval

Control how often shooting stars appear (in ticks):

```typescript
// Frequent shooting stars
createStars({ shootingInterval: [30, 90] });

// Rare shooting stars
createStars({ shootingInterval: [300, 600] });
```

### Twinkle Speed

```typescript
// Slow, gentle twinkle
createStars({ twinkleSpeed: 0.5 });

// Fast, flickering stars
createStars({ twinkleSpeed: 2.5 });
```
