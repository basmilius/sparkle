# Layering Effects

Sparkle supports combining multiple effects on a single canvas using `Scene`. Each effect is an independent layer that can be stacked on top of others.

## How It Works

Every effect class (e.g. `Aurora`, `Stars`, `Rain`) can be used standalone or as a layer inside a `Scene`. Effects contain the simulation logic without owning a canvas — they render onto whatever context they are given. `Scene` manages a single canvas and drives all layers with the same frame loop.

```
Scene (canvas + RAF loop)
  ├── Aurora    (draws first — background)
  ├── Stars     (draws on top)
  └── Rain      (draws on top)
```

## Basic Usage

```typescript
import { createAurora, createScene, createStars } from '@basmilius/sparkle';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

createScene()
    .mount(canvas)
    .layer(createAurora())
    .layer(createStars({ mode: 'shooting' }))
    .start();
```

The `layer()` method is chainable:

```typescript
createScene()
    .mount(canvas)
    .layer(createAurora({ bands: 6 }))
    .layer(createStars({ mode: 'shooting', shootingInterval: [200, 500] }))
    .start();
```

## Layer Ordering

Layers are drawn in the order they are added — the first layer draws first (bottom) and the last layer draws on top. Place background layers (like `Aurora`, `Waves`) first and particle effects on top.

## Configuration

Each layer accepts the same config options as when used standalone:

```typescript
createAurora({
    bands: 7,
    colors: ['#ff22aa', '#aa00ff']
})

createRain({
    variant: 'drizzle'
})

createLightning({
    branches: true,
    frequency: 0.5,
    color: '#ffcc88'
})
```

## Example Combinations

::: example Aurora Night Sky || Aurora with shooting stars layered on top.
example=../code/layered/aurora-night.vue
:::

```typescript
createScene()
    .mount(canvas)
    .layer(createAurora())
    .layer(createStars({ mode: 'both' }).withFade({ bottom: 0.4 }))
    .start();
```

::: example Thunderstorm || Heavy rain with separate lightning layer for full control.
example=../code/layered/thunderstorm.vue
:::

```typescript
createScene()
    .mount(canvas)
    .layer(createRain({ variant: 'downpour' }))
    .layer(createLightning({ branches: true, frequency: 0.4 }))
    .start();
```

::: example Festive Scene || Snow falling past festive balloons.
example=../code/layered/festive.vue
:::

```typescript
createScene()
    .mount(canvas)
    .layer(createSnow())
    .layer(createBalloons({ count: 8 }))
    .start();
```

## Interactive Layers

Layers with mouse or click interaction (bubbles, donuts, particles, sparklers) attach their event listeners to the `Scene` canvas automatically:

```typescript
createScene()
    .mount(canvas)
    .layer(createParticles({mouseMode: 'connect'}))
    .layer(createSparklers({hoverMode: true}))
    .start();
```
