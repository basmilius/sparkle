# Layering Effects

Sparkle supports combining multiple effects on a single canvas using `LayeredSimulation`. Each effect is an independent layer that can be stacked on top of others.

## How It Works

Every simulation has a corresponding **layer class** (e.g. `AuroraLayer`, `StarLayer`, `RainLayer`). Layers contain the simulation logic without owning a canvas — they render onto whatever context they are given. `LayeredSimulation` manages a single canvas and drives all layers with the same frame loop.

```
LayeredSimulation (canvas + RAF loop)
  ├── AuroraLayer   (draws first — background)
  ├── StarLayer     (draws on top)
  └── RainLayer     (draws on top)
```

## Basic Usage

```typescript
import { AuroraLayer, LayeredSimulation, StarLayer } from '@basmilius/sparkle';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const sim = new LayeredSimulation(canvas);
sim.add(new AuroraLayer());
sim.add(new StarLayer({ mode: 'shooting' }));
sim.start();
```

The `add()` method is chainable:

```typescript
new LayeredSimulation(canvas)
    .add(new AuroraLayer({ shootingStars: false }))
    .add(new StarLayer({ mode: 'shooting', shootingInterval: [200, 500] }))
    .start();
```

## Layer Ordering

Layers are drawn in the order they are added — the first layer draws first (bottom) and the last layer draws on top. Place background layers (like `AuroraLayer`, `WaveLayer`) first and particle effects on top.

## Configuration

Each layer accepts the same config options as its corresponding simulation:

```typescript
new AuroraLayer({
    bands: 7,
    colors: ['#ff22aa', '#aa00ff'],
    shootingStars: false
})

new RainLayer({
    variant: 'drizzle'
})

new LightningLayer({
    branches: true,
    frequency: 0.5,
    color: '#ffcc88'
})
```

## Example Combinations

### Aurora Night Sky

::: example Aurora Night Sky || Aurora with shooting stars layered on top.
example=../code/layered/aurora-night.vue
:::

```typescript
new LayeredSimulation(canvas)
    .add(new AuroraLayer())
    .add(new StarLayer({ mode: 'both' }).withFade({ bottom: 0.4 }))
    .start();
```

### Thunderstorm

::: example Thunderstorm || Heavy rain with separate lightning layer for full control.
example=../code/layered/thunderstorm.vue
:::

```typescript
new LayeredSimulation(canvas)
    .add(new RainLayer({ variant: 'downpour' }))
    .add(new LightningLayer({ branches: true, frequency: 0.4 }))
    .start();
```

### Festive Scene

::: example Festive Scene || Snow falling past festive balloons.
example=../code/layered/festive.vue
:::

```typescript
new LayeredSimulation(canvas)
    .add(new SnowLayer())
    .add(new BalloonLayer({ count: 8 }))
    .start();
```

## Interactive Layers

Layers with mouse or click interaction (bubbles, donuts, particles, sparklers) attach their event listeners to the `LayeredSimulation` canvas automatically:

```typescript
new LayeredSimulation(canvas)
    .add(new ParticleLayer({ mouseMode: 'connect' }))
    .add(new SparklerLayer({ hoverMode: true }))
    .start();
```

## Standalone Simulations

All existing simulations (`AuroraSimulation`, `StarSimulation`, etc.) continue to work unchanged — they internally use their layer class and manage their own canvas:

```typescript
// Still works exactly as before
const sim = new AuroraSimulation(canvas);
sim.start();
```
