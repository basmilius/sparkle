# Volcano

Erupting volcano with lava projectiles, glowing embers, and rising smoke. Projectiles arc upward from the crater and fall with gravity while embers drift and fade in the hot updraft.

::: render
render=../code/volcano/preview.vue
:::

## Examples

::: example Basic || Default settings.
example=../code/volcano/preview.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createVolcano } from '@basmilius/sparkle';

const volcano = createVolcano({
    speed: 1,
    projectiles: 30,
    embers: 60,
    intensity: 1,
    color: '#ff4400',
    smokeColor: '#444444',
    scale: 1
});
volcano.mount(canvas).start();
```

### `speed`

Controls the overall animation speed of projectiles, embers, and smoke.

```typescript
createVolcano({ speed: 1.5 });
```

### `projectiles`

The number of lava projectiles launched from the crater.

```typescript
createVolcano({ projectiles: 50 });
```

### `embers`

The number of glowing ember particles floating in the updraft.

```typescript
createVolcano({ embers: 100 });
```

### `intensity`

Controls the eruption force. Higher values launch projectiles higher and faster.

```typescript
createVolcano({ intensity: 1.5 });
```

### `color`

The base color of lava projectiles and embers.

```typescript
createVolcano({ color: '#ff6600' });
```

### `smokeColor`

The color of the rising smoke plume.

```typescript
createVolcano({ smokeColor: '#555555' });
```

### `scale`

Scales all size-related values proportionally.

```typescript
createVolcano({ scale: 1.5 });
```
