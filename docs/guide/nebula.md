# Nebula

Atmospheric space nebula with softly drifting color clouds and twinkling stars. Layered radial gradients create a dreamy, otherworldly glow effect.

::: render
render=../code/nebula/preview.vue
:::

## Examples

::: example Basic || Default settings.
example=../code/nebula/preview.vue
:::

## Configuration

```typescript
import { createNebula } from '@basmilius/sparkle';

const nebula = createNebula({
    starCount: 150,
    speed: 0.3,
    colors: ['#ff6b9d', '#c44dff', '#4d79ff', '#00d4ff'],
    scale: 1
});

nebula.mount(canvas).start();
```

### `starCount`

Number of twinkling stars scattered across the nebula. Default: `150`.

### `speed`

Controls the drift speed of the nebula clouds. Default: `0.3`.

### `colors`

Array of colors used for the nebula cloud blobs. Each color is used for one or more soft radial gradient blobs. Default: `['#ff6b9d', '#c44dff', '#4d79ff', '#00d4ff']`.

### `scale`

Uniform scale multiplier for the entire effect. Default: `1`.
