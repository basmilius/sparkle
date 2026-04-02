# Fireflies

The fireflies simulation creates floating glowing dots that softly fade in and out while drifting with organic, natural movement. Each firefly pulses independently, creating a magical nighttime atmosphere.

::: render
render=../code/fireflies/preview.vue
:::

## Examples

::: example Basic fireflies || A gentle swarm of fireflies with default settings.
example=../code/fireflies/preview.vue
:::

::: example Dense swarm || A larger, brighter swarm with faster pulsing.
example=../code/fireflies/dense.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { FireflySimulation } from '@basmilius/sparkle';

const sim = new FireflySimulation(canvas, {
    count: 60,
    color: '#b4ff6a',
    size: 6,
    speed: 1,
    glowSpeed: 1,
    scale: 1
});
sim.start();
```

### Count

Control the number of fireflies:

```typescript
// Sparse, subtle
new FireflySimulation(canvas, { count: 20 });

// Dense swarm
new FireflySimulation(canvas, { count: 150 });
```

### Color

Set the glow color using any CSS color string:

```typescript
// Warm yellow
new FireflySimulation(canvas, { color: '#ffcc33' });

// Cool blue
new FireflySimulation(canvas, { color: '#66ccff' });
```

### Glow Speed

Control how fast the fireflies pulse:

```typescript
// Slow, gentle pulse
new FireflySimulation(canvas, { glowSpeed: 0.5 });

// Fast, energetic pulse
new FireflySimulation(canvas, { glowSpeed: 2 });
```

### Movement Speed

```typescript
// Very slow drift
new FireflySimulation(canvas, { speed: 0.5 });

// Quick, lively movement
new FireflySimulation(canvas, { speed: 2 });
```
