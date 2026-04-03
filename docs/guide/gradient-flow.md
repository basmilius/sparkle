# Gradient Flow

Smooth morphing color gradients using metaball-style blending, creating a lava-lamp-like flow of colors. Soft blobs of color drift and merge organically across the canvas.

::: render
render=../code/gradient-flow/preview.vue
:::

## Examples

::: example Basic || Default settings.
example=../code/gradient-flow/preview.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createGradientFlow } from '@basmilius/sparkle';

const gradientFlow = createGradientFlow({
    speed: 0.5,
    colors: ['#ff6b9d', '#c44dff', '#4d79ff', '#00d4ff'],
    blobs: 5,
    resolution: 6,
    scale: 1
});
gradientFlow.mount(canvas).start();
```

### `speed`

Controls how fast the color blobs drift across the canvas. Default: `0.5`.

```typescript
createGradientFlow({ speed: 1 });
```

### `colors`

Array of colors used for the gradient blobs. Each blob picks a color from this palette.

```typescript
createGradientFlow({ colors: ['#ff4444', '#ff8800', '#ffcc00'] });
```

### `blobs`

Number of gradient blobs in the scene. More blobs create richer color mixing. Default: `5`.

```typescript
createGradientFlow({ blobs: 8 });
```

### `resolution`

Pixel step size for rendering. Lower values produce smoother gradients at higher rendering cost. Default: `6`.

```typescript
createGradientFlow({ resolution: 3 });
```

### `scale`

Scales all size-related values proportionally. Default: `1`.

```typescript
createGradientFlow({ scale: 1.5 });
```
