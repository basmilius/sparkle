# Waves

The waves simulation creates a stylized ocean scene with multiple layered sine waves drawn from back to front. Each wave layer has its own amplitude, frequency, and color, building up depth. White foam speckles appear near wave crests for added realism.

::: render
render=../code/waves/preview.vue
:::

## Examples

::: example Calm ocean || Gentle ocean waves with default settings.
example=../code/waves/preview.vue
:::

::: example Stormy seas || Faster waves with more foam for a rough ocean look.
example=../code/waves/stormy.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { createWaves } from '@basmilius/sparkle';

const waves = createWaves({
    layers: 5,
    speed: 1,
    colors: ['#0a3d6b', '#0e5a8a', '#1a7ab5', '#3399cc', '#66c2e0'],
    foamColor: '#ffffff',
    foamAmount: 0.4,
    scale: 1
});
waves.mount(canvas).start();
```

### Layers

Control the number of wave layers for more or less depth:

```typescript
// Minimal, two layers
createWaves({ layers: 2 });

// Rich, many layers
createWaves({ layers: 8 });
```

### Speed

Adjust the wave animation speed:

```typescript
// Calm, slow waves
createWaves({speed: 0.5});

// Stormy, fast waves
createWaves({speed: 2.5});
```

### Colors

Set custom colors for each wave layer, from back to front:

```typescript
// Tropical ocean
createWaves({
    colors: ['#005577', '#007799', '#00aacc', '#33ccee', '#88eeff']
});

// Sunset ocean
createWaves({
    colors: ['#2a1a4e', '#4a2060', '#8b3a62', '#d4634a', '#f4a53c']
});
```

### Foam

Control the amount and color of foam speckles near wave crests:

```typescript
// No foam
createWaves({ foamAmount: 0 });

// Heavy foam
createWaves({ foamAmount: 0.8 });

// Custom foam color
createWaves({ foamColor: '#e0f0ff', foamAmount: 0.5 });
```
