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
import { createMatrix } from '@basmilius/sparkle';

const matrix = createMatrix({
    columns: 50,
    speed: 1.5,
    color: '#00ff41',
    fontSize: 14,
    trailLength: 25,
    scale: 1
});
matrix.mount(canvas).start();
```

### Speed

Control how fast the characters fall:

```typescript
// Slow, relaxed rain
createMatrix({speed: 0.5});

// Fast, intense rain
createMatrix({speed: 2});
```

### Density

Adjust the number of active columns:

```typescript
// Sparse
createMatrix({ columns: 20 });

// Dense
createMatrix({ columns: 80 });
```

### Color

Change the primary color of the trailing characters:

```typescript
// Classic green
createMatrix({ color: '#00ff41' });

// Cyan
createMatrix({ color: '#00e5ff' });

// Red pill
createMatrix({ color: '#ff0040' });
```

### Font size

Adjust the character size, which also determines column spacing:

```typescript
// Small, dense characters
createMatrix({ fontSize: 10 });

// Large, readable characters
createMatrix({ fontSize: 20 });
```
