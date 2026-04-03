# Caustics

Swimming pool light refraction patterns — bright caustic lines that shimmer and shift like light on the bottom of a pool. The effect simulates the way water surfaces focus and defocus light into dancing bright lines.

::: render
render=../code/caustics/preview.vue
:::

## Examples

::: example Basic || Default settings.
example=../code/caustics/preview.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createCaustics } from '@basmilius/sparkle';

const caustics = createCaustics({
    speed: 1,
    resolution: 4,
    intensity: 0.7,
    color: '#4488cc',
    scale: 1
});
caustics.mount(canvas).start();
```

### `speed`

Controls the animation speed of the caustic shimmer. Default: `1`.

```typescript
createCaustics({ speed: 0.5 });
```

### `resolution`

Pixel step size for rendering. Lower values produce finer caustic detail at higher rendering cost. Default: `4`.

```typescript
createCaustics({ resolution: 2 });
```

### `intensity`

Brightness of the caustic lines (0–1). Higher values produce more contrast between bright caustic ridges and dark valleys. Default: `0.7`.

```typescript
createCaustics({ intensity: 0.9 });
```

### `color`

Base tint color for the caustic pattern. Use blue-greens for a pool look or warm tones for a sunset feel.

```typescript
createCaustics({ color: '#66aaee' });
```

### `scale`

Scales all size-related values proportionally. Default: `1`.

```typescript
createCaustics({ scale: 1.5 });
```
