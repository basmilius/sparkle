# Glitch

Digital glitch artifacts with horizontal slice displacement, RGB channel splits, scanlines, and random noise blocks. Creates a screen corruption aesthetic perfect for cyberpunk or error-themed visuals.

::: render
render=../code/glitch/preview.vue
:::

## Examples

::: example Basic || Default settings.
example=../code/glitch/preview.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createGlitch } from '@basmilius/sparkle';

const glitch = createGlitch({
    intensity: 0.5,
    speed: 1,
    rgbSplit: 3,
    scanlines: true,
    noiseBlocks: true,
    sliceDisplacement: true,
    color: '#00ff00',
    scale: 1
});
glitch.mount(canvas).start();
```

### `intensity`

Controls the overall strength of the glitch artifacts (0–1). Higher values produce more frequent and dramatic distortions.

```typescript
createGlitch({ intensity: 0.8 });
```

### `speed`

Speed multiplier for the glitch animation cycle.

```typescript
createGlitch({ speed: 1.5 });
```

### `rgbSplit`

Maximum pixel offset for the RGB channel separation effect.

```typescript
createGlitch({ rgbSplit: 6 });
```

### `scanlines`

Enable or disable the horizontal scanline overlay.

```typescript
createGlitch({ scanlines: false });
```

### `noiseBlocks`

Enable or disable random rectangular noise blocks appearing across the canvas.

```typescript
createGlitch({ noiseBlocks: false });
```

### `sliceDisplacement`

Enable or disable horizontal slice displacement, where bands of the image shift sideways.

```typescript
createGlitch({ sliceDisplacement: false });
```

### `color`

The primary color used for glitch artifacts and scanlines.

```typescript
createGlitch({ color: '#ff0044' });
```

### `scale`

Scales all size-related values proportionally.

```typescript
createGlitch({ scale: 1.5 });
```
