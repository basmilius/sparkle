# Roots

The roots effect procedurally grows root and branch systems upward from the bottom of the canvas. Each root system begins at a single point and grows with slight random deviations, branching as it goes. Lines are drawn as smooth quadratic bezier curves, with thicker trunks tapering to thin tips.

::: render
render=../code/roots/preview.vue
:::

## Examples

::: example Basic || Default root systems growing from the bottom.
example=../code/roots/preview.vue
:::

## Configuration

```typescript
import { createRoots } from '@basmilius/sparkle';

const roots = createRoots({
    count: 5,
    speed: 1,
    color: '#4a3728',
    branchProbability: 0.3,
    maxSegments: 200,
    scale: 1
});
roots.mount(canvas).start();
```

### Number of Root Systems

```typescript
createRoots({ count: 2 }); // two sparse trees
createRoots({ count: 10 }); // a dense forest
```

### Branching

Control how often roots split:

```typescript
createRoots({ branchProbability: 0.1 }); // few branches, sparse
createRoots({ branchProbability: 0.8 }); // highly branched, bushy
```

### Color

```typescript
createRoots({ color: '#2d4a1e' }); // dark green roots
createRoots({ color: '#6b4f3a' }); // warm brown roots
```

### Complexity

```typescript
createRoots({ maxSegments: 100 }); // short, quick growth
createRoots({ maxSegments: 400 }); // long, sprawling growth
```
