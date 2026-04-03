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
import { createStreamers } from '@basmilius/sparkle';

const streamers = createStreamers({
    count: 30,
    speed: 1.2,
    scale: 1
});
streamers.mount(canvas).start();
```

### Count

Control the number of streamers on screen:

```typescript
// Sparse streamers
createStreamers({ count: 10 });

// Dense party effect
createStreamers({ count: 40 });
```

### Speed

Adjust how fast the streamers fall:

```typescript
// Slow, gentle falling
createStreamers({speed: 0.5});

// Fast, energetic falling
createStreamers({speed: 2});
```

### Colors

Provide custom colors for the streamers:

```typescript
// Gold and silver theme
createStreamers({
    colors: ['#ffd700', '#c0c0c0', '#fffacd', '#e8e8e8']
});

// Monochrome blue
createStreamers({
    colors: ['#1e90ff', '#4169e1', '#6495ed', '#87ceeb']
});
```
