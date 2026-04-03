# HyperSpace

Warp-speed hyperspace effect with stars stretching into radial streaks. Stars accelerate outward from the center, leaving motion-blur trails that grow longer with distance — just like jumping to lightspeed.

::: render
render=../code/hyper-space/preview.vue
:::

## Examples

::: example Basic || Default settings.
example=../code/hyper-space/preview.vue
:::

## Configuration

```typescript
import { createHyperSpace } from '@basmilius/sparkle';

const hyperSpace = createHyperSpace({
    count: 250,
    speed: 1,
    color: '#ffffff',
    scale: 1
});

hyperSpace.mount(canvas).start();
```

### `count`

Number of stars radiating outward. Default: `250`.

### `speed`

Controls the outward velocity and acceleration of the stars. Default: `1`.

### `color`

Color of the star streaks. Default: `'#ffffff'`.

### `scale`

Uniform scale multiplier for the entire effect. Default: `1`.
