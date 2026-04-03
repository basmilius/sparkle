# Hologram

Holographic projection effect with scrolling scanlines, flicker, and floating data fragments. Simulates the look of a sci-fi holographic display.

::: render
render=../code/hologram/preview.vue
:::

## Examples

::: example Basic || Default settings.
example=../code/hologram/preview.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createHologram } from '@basmilius/sparkle';

const hologram = createHologram({
    speed: 1,
    scanlineSpacing: 3,
    flickerIntensity: 0.3,
    dataFragments: 15,
    color: '#00ccff',
    scale: 1
});
hologram.mount(canvas).start();
```

### `speed`

Speed multiplier for the scanline scroll and fragment animation.

```typescript
createHologram({ speed: 0.5 });
```

### `scanlineSpacing`

Pixel spacing between horizontal scanlines. Lower values create denser scanlines.

```typescript
createHologram({ scanlineSpacing: 2 });
```

### `flickerIntensity`

Strength of the random brightness flicker (0–1). Set to 0 to disable flickering entirely.

```typescript
createHologram({ flickerIntensity: 0.5 });
```

### `dataFragments`

Number of floating data fragments rendered within the holographic field.

```typescript
createHologram({ dataFragments: 25 });
```

### `color`

The base color of the holographic projection.

```typescript
createHologram({ color: '#44ffaa' });
```

### `scale`

Scales all size-related values proportionally.

```typescript
createHologram({ scale: 1.5 });
```
