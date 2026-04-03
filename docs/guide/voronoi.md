# Voronoi

Animated Voronoi diagram with colorful drifting cells and visible edges that continuously morph. Seed points move slowly across the canvas, causing cell boundaries to shift and reshape in real time.

::: render
render=../code/voronoi/preview.vue
:::

## Examples

::: example Basic || Default settings.
example=../code/voronoi/preview.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createVoronoi } from '@basmilius/sparkle';

const voronoi = createVoronoi({
    cells: 20,
    speed: 0.5,
    colors: ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'],
    edgeColor: '#ffffff',
    edgeWidth: 2,
    resolution: 3,
    scale: 1
});
voronoi.mount(canvas).start();
```

### `cells`

The number of Voronoi cells. More cells produce a more fine-grained pattern.

```typescript
createVoronoi({ cells: 40 });
```

### `speed`

How fast the seed points drift across the canvas. Lower values create a slow, meditative effect.

```typescript
createVoronoi({ speed: 1 });
```

### `colors`

Array of colors used for filling the cells. Colors are assigned to each cell randomly.

```typescript
createVoronoi({ colors: ['#1a535c', '#4ecdc4', '#ff6b6b'] });
```

### `edgeColor`

The color of the cell edges.

```typescript
createVoronoi({ edgeColor: '#000000' });
```

### `edgeWidth`

The width of the cell edges in pixels.

```typescript
createVoronoi({ edgeWidth: 3 });
```

### `resolution`

Pixel resolution for the Voronoi computation. Lower values are more detailed but more expensive.

```typescript
createVoronoi({ resolution: 1 });
```

### `scale`

Scales all size-related values proportionally.

```typescript
createVoronoi({ scale: 1.5 });
```
