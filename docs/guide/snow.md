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
import { SnowSimulation } from '@basmilius/effects';

const sim = new SnowSimulation(canvas, {
    particles: 300,
    size: 8,
    speed: 1.5,
    fillStyle: 'rgb(255 255 255 / .8)',
    scale: 1
});
sim.start();
```

### Particle Count

Control the density of the snowfall:

```typescript
// Light snowfall
new SnowSimulation(canvas, { particles: 50 });

// Heavy blizzard
new SnowSimulation(canvas, { particles: 500 });
```

### Snowflake Size

Set the maximum snowflake radius in pixels:

```typescript
// Small, fine snow
new SnowSimulation(canvas, { size: 3 });

// Large, fluffy snowflakes
new SnowSimulation(canvas, { size: 10 });
```

### Fall Speed

```typescript
// Gentle, slow drift
new SnowSimulation(canvas, { speed: 1 });

// Fast snowstorm
new SnowSimulation(canvas, { speed: 4 });
```

### Scale

Scale all snowflake sizes proportionally:

```typescript
// Half-size snowflakes
new SnowSimulation(canvas, { scale: 0.5 });

// Double-size snowflakes
new SnowSimulation(canvas, { scale: 2 });
```
