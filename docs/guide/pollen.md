# Pollen

Subtle floating pollen particles with a warm sunlight glow, drifting gently with the wind. Each particle has a soft radial glow that mimics sunlight catching tiny grains in the air.

::: render
render=../code/pollen/preview.vue
:::

## Examples

::: example Basic || Default settings.
example=../code/pollen/preview.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createPollen } from '@basmilius/sparkle';

const pollen = createPollen({
    count: 40,
    speed: 0.5,
    size: 3,
    color: '#fff8e1',
    glowSize: 2,
    wind: 0.3,
    scale: 1
});
pollen.mount(canvas).start();
```

### `count`

The number of pollen particles floating in the scene.

```typescript
createPollen({ count: 60 });
```

### `speed`

Controls how fast the pollen particles drift. Keep this low for a calm, lazy feel.

```typescript
createPollen({ speed: 0.3 });
```

### `size`

The base radius of each pollen particle in pixels.

```typescript
createPollen({ size: 4 });
```

### `color`

The color of the pollen particles. Warm tones work best for a sunlit look.

```typescript
createPollen({ color: '#ffe0b2' });
```

### `glowSize`

The size multiplier of the glow around each particle relative to the particle size.

```typescript
createPollen({ glowSize: 3 });
```

### `wind`

The horizontal wind strength affecting particle drift direction and speed.

```typescript
createPollen({ wind: 0.5 });
```

### `scale`

Scales all size-related values proportionally.

```typescript
createPollen({ scale: 1.5 });
```
