# Boids

The boids effect implements Craig Reynolds' classic flocking simulation. Each boid follows three steering rules — separation (avoid crowding), alignment (match neighbors' direction), and cohesion (move toward the group center) — producing emergent flocking behavior.

::: render
render=../code/boids/preview.vue
:::

## Examples

::: example Basic || Default flock with 80 boids.
example=../code/boids/preview.vue
:::

## Configuration

```typescript
import { createBoids } from '@basmilius/sparkle';

const boids = createBoids({
    count: 80,
    speed: 1,
    separation: 1,
    alignment: 1,
    cohesion: 1,
    color: '#44aaff',
    size: 6,
    scale: 1
});
boids.mount(canvas).start();
```

### Flock Size

```typescript
createBoids({ count: 30 });  // small flock
createBoids({ count: 200 }); // large flock
```

### Steering Weights

Adjust the three flocking rules independently:

```typescript
// Tight, close formation
createBoids({ cohesion: 2, separation: 0.5 });

// Scattered, each boid going its own way
createBoids({ separation: 3, cohesion: 0.2, alignment: 0.2 });
```

### Color and Size

```typescript
createBoids({ color: '#ff8844', size: 8 });
```
