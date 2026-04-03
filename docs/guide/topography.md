# Topography

Animated contour lines that shift and flow like a living topographic map. The underlying height field evolves over time, causing the contour lines to merge, split, and reshape continuously.

::: render
render=../code/topography/preview.vue
:::

## Examples

::: example Basic || Default settings.
example=../code/topography/preview.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createTopography } from '@basmilius/sparkle';

const topography = createTopography({
    speed: 0.5,
    resolution: 4,
    contourSpacing: 0.1,
    lineWidth: 1.5,
    color: '#2d5016',
    scale: 1
});
topography.mount(canvas).start();
```

### `speed`

Controls how fast the height field evolves. Default: `0.5`.

```typescript
createTopography({ speed: 1 });
```

### `resolution`

Pixel step size for the height field grid. Lower values produce smoother contour lines at higher rendering cost. Default: `4`.

```typescript
createTopography({ resolution: 2 });
```

### `contourSpacing`

Spacing between contour levels as a fraction of the height range (0–1). Smaller values produce more contour lines. Default: `0.1`.

```typescript
createTopography({ contourSpacing: 0.05 });
```

### `lineWidth`

Width of the contour lines in pixels. Default: `1.5`.

```typescript
createTopography({ lineWidth: 2 });
```

### `color`

Color of the contour lines. Use earthy greens for a classic topo map look.

```typescript
createTopography({ color: '#446633' });
```

### `scale`

Scales all size-related values proportionally. Default: `1`.

```typescript
createTopography({ scale: 1.5 });
```
