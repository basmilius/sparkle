# Glitter

The glitter simulation creates sparkling pieces that slowly fall and tumble through the air with a 3D flip rotation. When they reach the ground, they settle and continue to sparkle with occasional bright flashes. Old settled pieces are automatically removed to keep performance steady.

::: render
render=../code/glitter/preview.vue
:::

## Examples

::: example Basic glitter || A colorful shower of glitter falling and accumulating on the ground.
example=../code/glitter/preview.vue
:::

::: example Golden glitter || A luxurious golden glitter effect with more particles.
example=../code/glitter/golden.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createGlitter } from '@basmilius/sparkle';

const glitter = createGlitter({
    count: 80,
    colors: ['#ffd700', '#c0c0c0', '#ff69b4'],
    size: 4,
    speed: 1,
    groundLevel: 0.85,
    maxSettled: 200,
    scale: 1
});
glitter.mount(canvas).start();
```

### Count

Control the number of falling glitter pieces:

```typescript
// Subtle, sparse
createGlitter({ count: 30 });

// Heavy glitter shower
createGlitter({ count: 150 });
```

### Colors

Set custom glitter colors using hex strings:

```typescript
// Golden theme
createGlitter({
    colors: ['#ffd700', '#ffb700', '#daa520']
});

// Silver and blue
createGlitter({
    colors: ['#c0c0c0', '#e0e0e0', '#87ceeb']
});
```

### Ground Level

Control where glitter settles (0 = top, 1 = bottom):

```typescript
// Settle higher up
createGlitter({ groundLevel: 0.7 });

// Settle near the bottom
createGlitter({ groundLevel: 0.95 });
```

### Speed

Control how fast the glitter falls:

```typescript
// Slow, gentle drift
createGlitter({speed: 0.5});

// Fast cascade
createGlitter({speed: 2});
```

### Max Settled

Control how many settled pieces remain on the ground:

```typescript
// Minimal accumulation
createGlitter({ maxSettled: 50 });

// Dense carpet of glitter
createGlitter({ maxSettled: 500 });
```
