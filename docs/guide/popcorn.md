# Popcorn

Popcorn kernels popping up from the bottom with bouncing physics, growing into fluffy shapes mid-air. Each kernel launches upward with a random force and bounces when it lands.

::: render
render=../code/popcorn/preview.vue
:::

## Examples

::: example Basic || Default settings.
example=../code/popcorn/preview.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createPopcorn } from '@basmilius/sparkle';

const popcorn = createPopcorn({
    count: 25,
    speed: 1,
    gravity: 1,
    bounciness: 0.6,
    color: '#fff8dc',
    popRate: 2,
    scale: 1
});
popcorn.mount(canvas).start();
```

### `count`

Maximum number of popcorn kernels visible at once.

```typescript
createPopcorn({ count: 40 });
```

### `speed`

Overall speed multiplier affecting how fast kernels move.

```typescript
createPopcorn({ speed: 1.5 });
```

### `gravity`

Gravity strength pulling kernels back down. Higher values make kernels fall faster.

```typescript
createPopcorn({ gravity: 1.5 });
```

### `bounciness`

How much energy is retained on each bounce (0–1). A value of 1 means a perfectly elastic bounce.

```typescript
createPopcorn({ bounciness: 0.8 });
```

### `color`

The base color of the popcorn kernels.

```typescript
createPopcorn({ color: '#ffe4b5' });
```

### `popRate`

How many new kernels pop per second.

```typescript
createPopcorn({ popRate: 5 });
```

### `scale`

Scales all size-related values proportionally.

```typescript
createPopcorn({ scale: 1.5 });
```
