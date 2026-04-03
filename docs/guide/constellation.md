# Constellation

Twinkling stars that slowly drift and connect into constellation patterns with proximity-based lines. Stars within range of each other are linked by faint lines, forming organic geometric networks.

::: render
render=../code/constellation/preview.vue
:::

## Examples

::: example Basic || Default settings.
example=../code/constellation/preview.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createConstellation } from '@basmilius/sparkle';

const constellation = createConstellation({
    stars: 50,
    speed: 1,
    connectionDistance: 120,
    color: '#ffffff',
    lineWidth: 0.5,
    twinkleSpeed: 1,
    scale: 1
});
constellation.mount(canvas).start();
```

### `stars`

Number of stars rendered on the canvas.

```typescript
createConstellation({ stars: 80 });
```

### `speed`

Speed multiplier for the drifting star movement.

```typescript
createConstellation({ speed: 0.5 });
```

### `connectionDistance`

Maximum pixel distance at which two stars will be connected by a line. Lines fade in opacity as stars approach the distance limit.

```typescript
createConstellation({ connectionDistance: 180 });
```

### `color`

Color of the stars and connection lines.

```typescript
createConstellation({ color: '#aaccff' });
```

### `lineWidth`

Width of the connection lines in pixels.

```typescript
createConstellation({ lineWidth: 1 });
```

### `twinkleSpeed`

Speed of the star brightness oscillation. Higher values produce faster twinkling.

```typescript
createConstellation({ twinkleSpeed: 2 });
```

### `scale`

Scales all size-related values proportionally.

```typescript
createConstellation({ scale: 1.5 });
```
