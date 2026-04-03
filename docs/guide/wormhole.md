# Wormhole

The wormhole simulation creates a starfield tunnel effect where particles flow radially toward or away from the center of the canvas. Particles accelerate as they approach their destination, leaving luminous trails that grow longer and brighter. The center features a subtle glow, completing the wormhole illusion.

::: render
render=../code/wormhole/preview.vue
:::

## Examples

::: example Inward || Particles streaming toward the center.
example=../code/wormhole/preview.vue
:::

::: example Outward || Particles expanding outward from the center.
example=../code/wormhole/outward.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createWormhole } from '@basmilius/sparkle';

const wormhole = createWormhole({
    count: 200,
    speed: 1,
    color: '#6699ff',
    direction: 'inward',
    scale: 1
});
wormhole.mount(canvas).start();
```

### Direction

Control whether particles flow inward or outward:

```typescript
// Particles converge toward the center
createWormhole({ direction: 'inward' });

// Particles expand outward from the center
createWormhole({ direction: 'outward' });
```

### Speed

Adjust the overall particle speed:

```typescript
// Slow, drifting particles
createWormhole({speed: 0.5});

// Fast, intense tunnel
createWormhole({speed: 2});
```

### Count

Control particle density:

```typescript
// Sparse tunnel
createWormhole({ count: 80 });

// Dense starfield
createWormhole({ count: 400 });
```

### Color

Change the particle and glow color:

```typescript
// Blue (default)
createWormhole({ color: '#6699ff' });

// Warm orange
createWormhole({ color: '#ff9944' });

// Green
createWormhole({ color: '#44ff88' });
```
