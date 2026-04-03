# Lava

The lava effect simulates a lava lamp with soft, glowing blobs of different colors floating up and down. Blobs blend together using screen compositing, creating a warm and mesmerizing ambient effect.

::: render
render=../code/lava/preview.vue
:::

## Examples

::: example Basic || Default lava lamp settings.
example=../code/lava/preview.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createLava } from '@basmilius/sparkle';

const lava = createLava({
    count: 12,
    speed: 1,
    colors: ['#ff4400', '#ff8800', '#ffcc00', '#ff0066'],
    scale: 1
});
lava.mount(canvas).start();
```

### Blob Count

Control the number of lava blobs:

```typescript
// Fewer, more spaced blobs
createLava({ count: 6 });

// Dense lava lamp
createLava({ count: 20 });
```

### Speed

Control how fast the blobs move:

```typescript
// Slow and calm
createLava({ speed: 0.5 });

// Fast and chaotic
createLava({ speed: 3 });
```

### Colors

Set the color palette for the lava blobs:

```typescript
// Cool blue/purple tones
createLava({ colors: ['#0044ff', '#8800ff', '#00ccff', '#cc00ff'] });

// Classic lava lamp red/orange
createLava({ colors: ['#ff4400', '#ff8800', '#ffcc00'] });
```

### Scale

Scale all blob sizes proportionally:

```typescript
// Smaller blobs
createLava({ scale: 0.5 });

// Larger blobs
createLava({ scale: 2 });
```
