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
import { createSparklers } from '@basmilius/sparkle';

const sparklers = createSparklers({
    emitRate: 8,
    maxSparks: 300,
    gravity: 0.8,
    friction: 0.96,
    hoverMode: false,
    scale: 1
});
sparklers.mount(canvas).start();
```

### Emit Rate

Control how many sparks are emitted per frame:

```typescript
// Subtle, few sparks
createSparklers({ emitRate: 3 });

// Intense shower
createSparklers({ emitRate: 15 });
```

### Hover Mode

Make the sparkler follow the mouse:

```typescript
createSparklers({ hoverMode: true });
```

### Colors

Set custom spark colors:

```typescript
// Cool blue sparks
createSparklers({
    colors: ['#4488ff', '#88ccff', '#ffffff']
});

// Red and gold
createSparklers({
    colors: ['#ff4444', '#ffaa00', '#ffee88']
});
```

### Physics

Fine-tune the spark behavior:

```typescript
// Slow, floaty sparks
createSparklers({
    friction: 0.99,
    gravity: 0.3,
    speed: [1, 4]
});

// Fast, heavy sparks
createSparklers({
    friction: 0.93,
    gravity: 1.5,
    speed: [4, 12]
});
```

### Position

Manually set the emission point:

```typescript
const sparklers = createSparklers();
sparklers.mount(canvas).start();

// Move to top-left corner (normalized 0-1)
sparklers.moveTo(0.2, 0.2);
```
