# Matrix

The matrix simulation recreates the iconic falling character rain from The Matrix. Columns of Japanese katakana and digits cascade down the screen, each with a bright head character and a trailing fade. Characters randomly mutate as they fall, creating the signature digital rain effect.

::: render
render=../code/matrix/preview.vue
:::

## Examples

::: example Default || Classic green matrix rain with default settings.
example=../code/matrix/preview.vue
:::

::: example Fast || Faster, denser rain with smaller characters.
example=../code/matrix/fast.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { MatrixSimulation } from '@basmilius/sparkle';

const sim = new MatrixSimulation(canvas, {
    columns: 50,
    speed: 1.5,
    color: '#00ff41',
    fontSize: 14,
    trailLength: 25,
    scale: 1
});
sim.start();
```

### Speed

Control how fast the characters fall:

```typescript
// Slow, relaxed rain
new MatrixSimulation(canvas, { speed: 0.5 });

// Fast, intense rain
new MatrixSimulation(canvas, { speed: 2 });
```

### Density

Adjust the number of active columns:

```typescript
// Sparse
new MatrixSimulation(canvas, { columns: 20 });

// Dense
new MatrixSimulation(canvas, { columns: 80 });
```

### Color

Change the primary color of the trailing characters:

```typescript
// Classic green
new MatrixSimulation(canvas, { color: '#00ff41' });

// Cyan
new MatrixSimulation(canvas, { color: '#00e5ff' });

// Red pill
new MatrixSimulation(canvas, { color: '#ff0040' });
```

### Font size

Adjust the character size, which also determines column spacing:

```typescript
// Small, dense characters
new MatrixSimulation(canvas, { fontSize: 10 });

// Large, readable characters
new MatrixSimulation(canvas, { fontSize: 20 });
```
