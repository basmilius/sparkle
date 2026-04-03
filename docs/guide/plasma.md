# Plasma

The plasma simulation creates flowing, colorful patterns using layered sine functions. Multiple color waves overlap and shift over time, producing the classic psychedelic plasma effect. An offscreen canvas at reduced resolution keeps performance smooth.

::: render
render=../code/plasma/preview.vue
:::

## Examples

::: example Basic plasma || Flowing plasma with the default psychedelic palette.
example=../code/plasma/preview.vue
:::

::: example Fast plasma || Faster animation with lower resolution for a retro chunky look.
example=../code/plasma/fast.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createPlasma } from '@basmilius/sparkle';

const plasma = createPlasma({
    speed: 1,
    scale: 1,
    resolution: 4,
    palette: [
        {r: 0, g: 255, b: 255},
        {r: 255, g: 0, b: 255},
        {r: 255, g: 255, b: 0},
        {r: 0, g: 100, b: 255},
        {r: 0, g: 255, b: 100}
    ]
});
plasma.mount(canvas).start();
```

### Speed

Control the animation speed:

```typescript
// Slow, meditative
createPlasma({speed: 0.3});

// Fast, energetic
createPlasma({speed: 3});
```

### Scale

Adjust the size of the plasma patterns:

```typescript
// Zoomed in, large patterns
createPlasma({ scale: 2 });

// Zoomed out, fine detail
createPlasma({ scale: 0.5 });
```

### Resolution

Set the pixel block size for rendering. Higher values are faster but chunkier:

```typescript
// Sharp, detailed (slower)
createPlasma({ resolution: 2 });

// Chunky, retro feel (faster)
createPlasma({ resolution: 8 });
```

### Palette

Define custom colors for the plasma gradient:

```typescript
// Fire palette
createPlasma({
    palette: [
        { r: 255, g: 0, b: 0 },
        { r: 255, g: 165, b: 0 },
        { r: 255, g: 255, b: 0 },
        { r: 100, g: 0, b: 0 }
    ]
});

// Ocean palette
createPlasma({
    palette: [
        { r: 0, g: 20, b: 80 },
        { r: 0, g: 100, b: 200 },
        { r: 0, g: 200, b: 255 },
        { r: 200, g: 255, b: 255 }
    ]
});
```
