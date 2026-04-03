# Snow

The snow simulation creates a gentle, continuous snowfall effect. Snowflakes drift downward with a subtle wave motion and vary in size, creating a natural look.

::: render
render=../code/snow/preview.vue
:::

## Examples

::: example Basic snowfall || A simple snowfall with default settings.
example=../code/snow/preview.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createSnow } from '@basmilius/sparkle';

const snow = createSnow({
    particles: 300,
    size: 8,
    speed: 1.5,
    fillStyle: 'rgb(255 255 255 / .8)',
    scale: 1
});
snow.mount(canvas).start();
```

### Particle Count

Control the density of the snowfall:

```typescript
// Light snowfall
createSnow({ particles: 50 });

// Heavy blizzard
createSnow({ particles: 500 });
```

### Snowflake Size

Set the maximum snowflake radius in pixels:

```typescript
// Small, fine snow
createSnow({ size: 3 });

// Large, fluffy snowflakes
createSnow({ size: 10 });
```

### Fall Speed

```typescript
// Gentle, slow drift
createSnow({speed: 1});

// Fast snowstorm
createSnow({speed: 4});
```

### Scale

Scale all snowflake sizes proportionally:

```typescript
// Half-size snowflakes
createSnow({scale: 0.5});

// Double-size snowflakes
createSnow({scale: 2});
```
