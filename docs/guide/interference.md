# Interference

Moiré interference patterns created by overlapping concentric wave sources moving in Lissajous paths. The overlapping waves produce mesmerizing visual beats and shifting geometric patterns.

::: render
render=../code/interference/preview.vue
:::

## Examples

::: example Basic || Default settings.
example=../code/interference/preview.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createInterference } from '@basmilius/sparkle';

const interference = createInterference({
    speed: 1,
    resolution: 3,
    layers: 3,
    colors: ['#ff4488', '#4488ff', '#44ff88'],
    scale: 1
});
interference.mount(canvas).start();
```

### `speed`

Overall animation speed multiplier. Controls how fast the wave sources move along their Lissajous paths. Default: `1`.

```typescript
createInterference({ speed: 0.5 });
```

### `resolution`

Pixel step size for rendering. Lower values produce sharper patterns but are more expensive to render. Default: `3`.

```typescript
createInterference({ resolution: 2 });
```

### `layers`

Number of concentric wave sources. More layers create more complex interference patterns. Default: `3`.

```typescript
createInterference({ layers: 5 });
```

### `colors`

Array of colors for each wave source layer. Colors are cycled if there are more layers than colors.

```typescript
createInterference({ colors: ['#ff0000', '#00ff00', '#0000ff'] });
```

### `scale`

Scales all size-related values proportionally. Default: `1`.

```typescript
createInterference({ scale: 1.5 });
```
