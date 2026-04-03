# Kaleidoscope

Symmetrically mirrored rotating patterns creating ever-changing kaleidoscope visuals with glowing shapes. Geometric shapes are reflected across multiple segments radiating from the center.

::: render
render=../code/kaleidoscope/preview.vue
:::

## Examples

::: example Basic || Default settings.
example=../code/kaleidoscope/preview.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createKaleidoscope } from '@basmilius/sparkle';

const kaleidoscope = createKaleidoscope({
    segments: 8,
    speed: 1,
    shapes: 15,
    colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7dc6f', '#bb8fce'],
    scale: 1
});
kaleidoscope.mount(canvas).start();
```

### `segments`

The number of symmetry segments in the kaleidoscope. Higher values create more intricate mirror patterns.

```typescript
createKaleidoscope({ segments: 12 });
```

### `speed`

How fast the shapes rotate and morph.

```typescript
createKaleidoscope({ speed: 0.5 });
```

### `shapes`

The number of shapes rendered per segment. More shapes produce denser, more complex patterns.

```typescript
createKaleidoscope({ shapes: 25 });
```

### `colors`

Array of colors used for the shapes. Colors are randomly assigned to each shape.

```typescript
createKaleidoscope({ colors: ['#e74c3c', '#3498db', '#2ecc71'] });
```

### `scale`

Scales all size-related values proportionally.

```typescript
createKaleidoscope({ scale: 1.5 });
```
