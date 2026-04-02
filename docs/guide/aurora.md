# Aurora

The aurora simulation creates flowing, colorful light bands that slowly wave across the screen, mimicking the northern lights. Multiple translucent bands overlap with additive blending, and their colors shift over time.

::: render
render=../code/aurora/preview.vue
:::

## Examples

::: example Basic aurora || Gentle aurora borealis with default settings.
example=../code/aurora/preview.vue
:::

::: example High intensity || Brighter, faster aurora with more bands.
example=../code/aurora/intense.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { AuroraSimulation } from '@basmilius/sparkle';

const sim = new AuroraSimulation(canvas, {
    bands: 4,
    colors: ['#00ff88', '#00aaff', '#8844ff', '#ff44aa'],
    speed: 1,
    intensity: 0.6,
    waveAmplitude: 1,
    verticalPosition: 0.3
});
sim.start();
```

### Bands

Control the number of light bands:

```typescript
// Subtle, minimal
new AuroraSimulation(canvas, { bands: 2 });

// Rich, layered
new AuroraSimulation(canvas, { bands: 6 });
```

### Colors

Set custom band colors:

```typescript
// Warm sunset aurora
new AuroraSimulation(canvas, {
    colors: ['#ff6644', '#ffaa00', '#ff44aa']
});

// Cool ocean tones
new AuroraSimulation(canvas, {
    colors: ['#0044ff', '#00ccff', '#00ffaa']
});
```

### Intensity

Control the overall brightness:

```typescript
// Subtle, background effect
new AuroraSimulation(canvas, { intensity: 0.3 });

// Vivid, dramatic
new AuroraSimulation(canvas, { intensity: 1.0 });
```

### Vertical Position

Place the aurora higher or lower on the screen:

```typescript
// Near the top
new AuroraSimulation(canvas, { verticalPosition: 0.15 });

// Center of the screen
new AuroraSimulation(canvas, { verticalPosition: 0.5 });
```
