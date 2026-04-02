# Sparklers

The sparklers simulation creates a sparking point that continuously emits flying sparks with glowing trails. Sparks fly in all directions, slow down with friction, and fall with gravity. The emission point can follow the mouse cursor for interactive hover effects.

::: render
render=../code/sparklers/preview.vue
:::

## Examples

::: example Basic sparkler || A sparkler emitting from the center of the canvas.
example=../code/sparklers/preview.vue
:::

::: example Hover mode || The sparkler follows your mouse cursor.
example=../code/sparklers/hover.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { SparklerSimulation } from '@basmilius/sparkle';

const sim = new SparklerSimulation(canvas, {
    emitRate: 8,
    maxSparks: 300,
    gravity: 0.8,
    friction: 0.96,
    hoverMode: false,
    scale: 1
});
sim.start();
```

### Emit Rate

Control how many sparks are emitted per frame:

```typescript
// Subtle, few sparks
new SparklerSimulation(canvas, { emitRate: 3 });

// Intense shower
new SparklerSimulation(canvas, { emitRate: 15 });
```

### Hover Mode

Make the sparkler follow the mouse:

```typescript
new SparklerSimulation(canvas, { hoverMode: true });
```

### Colors

Set custom spark colors:

```typescript
// Cool blue sparks
new SparklerSimulation(canvas, {
    colors: ['#4488ff', '#88ccff', '#ffffff']
});

// Red and gold
new SparklerSimulation(canvas, {
    colors: ['#ff4444', '#ffaa00', '#ffee88']
});
```

### Physics

Fine-tune the spark behavior:

```typescript
// Slow, floaty sparks
new SparklerSimulation(canvas, {
    friction: 0.99,
    gravity: 0.3,
    speed: [1, 4]
});

// Fast, heavy sparks
new SparklerSimulation(canvas, {
    friction: 0.93,
    gravity: 1.5,
    speed: [4, 12]
});
```

### Position

Manually set the emission point:

```typescript
const sim = new SparklerSimulation(canvas);
sim.start();

// Move to top-left corner (normalized 0-1)
sim.setPosition(0.2, 0.2);
```
