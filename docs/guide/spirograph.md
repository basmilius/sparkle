# Spirograph

The spirograph effect draws hypotrochoid curves — the mathematical patterns produced by a pen tracing inside a rolling circle. Multiple curves draw simultaneously, each slowly fading before being replaced by a new pattern with different radii, creating an endlessly evolving geometric display.

::: render
render=../code/spirograph/preview.vue
:::

## Examples

::: example Basic || Three simultaneous spirograph curves with default colors.
example=../code/spirograph/preview.vue
:::

## Configuration

```typescript
import { createSpirograph } from '@basmilius/sparkle';

const spirograph = createSpirograph({
    speed: 1,
    curves: 3,
    colors: ['#ff3366', '#33aaff', '#ffcc00', '#66ff99', '#cc66ff', '#ff6633'],
    lineWidth: 1.5,
    fadeSpeed: 0.003,
    complexity: 5,
    scale: 1
});
spirograph.mount(canvas).start();
```

### Number of Curves

```typescript
// Single focused curve
createSpirograph({ curves: 1 });

// Many overlapping patterns
createSpirograph({ curves: 6 });
```

### Complexity

Controls which denominator values are used when computing the gear ratio, affecting how intricate the patterns are:

```typescript
// Simple, few-pointed stars
createSpirograph({ complexity: 2 });

// Complex, many-petalled flowers
createSpirograph({ complexity: 8 });
```

### Line Width

```typescript
// Thin, delicate lines
createSpirograph({ lineWidth: 0.5 });

// Bold, thick strokes
createSpirograph({ lineWidth: 3 });
```

### Fade Speed

Controls how quickly a curve fades before being replaced:

```typescript
// Long-lived patterns
createSpirograph({ fadeSpeed: 0.001 });

// Fast turnover
createSpirograph({ fadeSpeed: 0.01 });
```
