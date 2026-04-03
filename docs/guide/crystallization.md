# Crystallization

Ice crystals growing from seed points in hexagonal fractal branching patterns with sparkle effects. Branches extend outward at precise angles, splitting recursively to form intricate snowflake-like structures.

::: render
render=../code/crystallization/preview.vue
:::

## Examples

::: example Basic || Default settings.
example=../code/crystallization/preview.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createCrystallization } from '@basmilius/sparkle';

const crystallization = createCrystallization({
    seeds: 5,
    speed: 1,
    branchAngle: 60,
    maxDepth: 5,
    color: '#88ccff',
    scale: 1
});
crystallization.mount(canvas).start();
```

### `seeds`

The number of seed points from which crystals grow.

```typescript
createCrystallization({ seeds: 8 });
```

### `speed`

Controls how fast the crystal branches grow outward.

```typescript
createCrystallization({ speed: 1.5 });
```

### `branchAngle`

The angle in degrees at which new branches split off from the parent branch. A value of 60 creates hexagonal patterns.

```typescript
createCrystallization({ branchAngle: 45 });
```

### `maxDepth`

The maximum recursion depth for branching. Higher values create more detailed but more complex crystals.

```typescript
createCrystallization({ maxDepth: 7 });
```

### `color`

The base color of the crystal branches. Light blues work well for an icy look.

```typescript
createCrystallization({ color: '#aaddff' });
```

### `scale`

Scales all size-related values proportionally.

```typescript
createCrystallization({ scale: 1.5 });
```
