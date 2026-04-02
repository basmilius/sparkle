# Petals

The petals simulation creates softly drifting cherry blossom petals with gentle tumbling and swaying motion. Each petal has a delicate 3D flip effect, creating a serene spring atmosphere.

::: render
render=../code/petals/preview.vue
:::

## Examples

::: example Cherry blossoms || Gentle sakura petals with default settings.
example=../code/petals/preview.vue
:::

::: example Dense bloom || A dense shower of cherry blossom petals.
example=../code/petals/dense.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { PetalSimulation } from '@basmilius/sparkle';

const sim = new PetalSimulation(canvas, {
    count: 100,
    colors: ['#ffb7c5', '#ffc0cb', '#ffd1dc'],
    size: 10,
    speed: 0.7,
    wind: 0.15,
    scale: 1
});
sim.start();
```

### Count

Control the number of petals:

```typescript
// Sparse, subtle
new PetalSimulation(canvas, { count: 30 });

// Dense bloom
new PetalSimulation(canvas, { count: 250 });
```

### Wind

Control the horizontal drift:

```typescript
// Still air
new PetalSimulation(canvas, { wind: 0 });

// Gentle breeze
new PetalSimulation(canvas, { wind: 0.4 });
```

### Colors

Customize the petal palette:

```typescript
// White blossoms
new PetalSimulation(canvas, {
    colors: ['#ffffff', '#fff5f5', '#ffe8ec']
});

// Deep pink
new PetalSimulation(canvas, {
    colors: ['#ff69b4', '#ff1493', '#db7093']
});
```

### Speed

```typescript
// Very slow, dreamy
new PetalSimulation(canvas, { speed: 0.3 });

// Lively spring breeze
new PetalSimulation(canvas, { speed: 1.5 });
```
