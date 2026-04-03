# Pulse Grid

A grid of dots that light up in expanding wave patterns, creating ripple effects across the canvas. Each wave radiates outward from a random origin point, illuminating dots as it passes.

::: render
render=../code/pulse-grid/preview.vue
:::

## Examples

::: example Basic || Default settings.
example=../code/pulse-grid/preview.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createPulseGrid } from '@basmilius/sparkle';

const pulseGrid = createPulseGrid({
    spacing: 30,
    speed: 1,
    color: '#4488ff',
    dotSize: 2,
    waveCount: 3,
    waveSpeed: 100,
    scale: 1
});
pulseGrid.mount(canvas).start();
```

### `spacing`

Distance in pixels between dots in the grid. Smaller values create a denser grid. Default: `30`.

```typescript
createPulseGrid({ spacing: 20 });
```

### `speed`

Overall animation speed multiplier. Default: `1`.

```typescript
createPulseGrid({ speed: 1.5 });
```

### `color`

Base color of the dots. Dots fade between a dim resting state and this color when a wave passes through.

```typescript
createPulseGrid({ color: '#ff6644' });
```

### `dotSize`

Radius of each dot in the grid. Default: `2`.

```typescript
createPulseGrid({ dotSize: 3 });
```

### `waveCount`

Number of simultaneous ripple waves active at once. Default: `3`.

```typescript
createPulseGrid({ waveCount: 5 });
```

### `waveSpeed`

How fast each wave expands outward from its origin, in pixels per second. Default: `100`.

```typescript
createPulseGrid({ waveSpeed: 200 });
```

### `scale`

Scales all size-related values proportionally. Default: `1`.

```typescript
createPulseGrid({ scale: 1.5 });
```
