# Black Hole

Particles spiral inward toward a central black hole, accelerating as they approach the event horizon. The dramatic gravitational pull creates a mesmerizing vortex of light.

::: render
render=../code/black-hole/preview.vue
:::

## Examples

::: example Basic || Default settings.
example=../code/black-hole/preview.vue
:::

## Configuration

```typescript
import { createBlackHole } from '@basmilius/sparkle';

const blackHole = createBlackHole({
    count: 300,
    speed: 1,
    color: '#6644ff',
    size: 2,
    scale: 1
});

blackHole.mount(canvas).start();
```

### `count`

Number of particles spiraling toward the black hole. Default: `300`.

### `speed`

Controls the inward spiral speed of the particles. Default: `1`.

### `color`

Base color of the particles. Particles shift toward white as they approach the event horizon. Default: `'#6644ff'`.

### `size`

Base size of each particle in pixels. Default: `2`.

### `scale`

Uniform scale multiplier for the entire effect. Default: `1`.
