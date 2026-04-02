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
import { WormholeSimulation } from '@basmilius/sparkle';

const sim = new WormholeSimulation(canvas, {
    count: 200,
    speed: 1,
    color: '#6699ff',
    direction: 'inward',
    scale: 1
});
sim.start();
```

### Direction

Control whether particles flow inward or outward:

```typescript
// Particles converge toward the center
new WormholeSimulation(canvas, { direction: 'inward' });

// Particles expand outward from the center
new WormholeSimulation(canvas, { direction: 'outward' });
```

### Speed

Adjust the overall particle speed:

```typescript
// Slow, drifting particles
new WormholeSimulation(canvas, { speed: 0.5 });

// Fast, intense tunnel
new WormholeSimulation(canvas, { speed: 2 });
```

### Count

Control particle density:

```typescript
// Sparse tunnel
new WormholeSimulation(canvas, { count: 80 });

// Dense starfield
new WormholeSimulation(canvas, { count: 400 });
```

### Color

Change the particle and glow color:

```typescript
// Blue (default)
new WormholeSimulation(canvas, { color: '#6699ff' });

// Warm orange
new WormholeSimulation(canvas, { color: '#ff9944' });

// Green
new WormholeSimulation(canvas, { color: '#44ff88' });
```
