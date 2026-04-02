# Sandstorm

The sandstorm simulation creates horizontal sand particles blowing across the screen with realistic wind gusts and turbulence. A subtle haze layer adds atmospheric depth.

::: render
render=../code/sandstorm/preview.vue
:::

## Examples

::: example Desert wind || A moderate sandstorm with default settings.
example=../code/sandstorm/preview.vue
:::

::: example Intense storm || A heavy sandstorm with strong wind and thick haze.
example=../code/sandstorm/intense.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { SandstormSimulation } from '@basmilius/sparkle';

const sim = new SandstormSimulation(canvas, {
    count: 300,
    wind: 1,
    turbulence: 1,
    color: '#c2956b',
    hazeOpacity: 0.15,
    scale: 1
});
sim.start();
```

### Wind

Control the horizontal wind strength:

```typescript
// Light breeze
new SandstormSimulation(canvas, { wind: 0.3 });

// Hurricane-force
new SandstormSimulation(canvas, { wind: 2 });
```

### Turbulence

Control the chaotic movement of particles:

```typescript
// Smooth, steady wind
new SandstormSimulation(canvas, { turbulence: 0.3 });

// Wild, gusty storm
new SandstormSimulation(canvas, { turbulence: 2 });
```

### Color

Change the sand color:

```typescript
// Red desert sand
new SandstormSimulation(canvas, { color: '#c4704b' });

// Light beach sand
new SandstormSimulation(canvas, { color: '#e8d5a3' });
```

### Haze

Control the atmospheric haze layer:

```typescript
// No haze
new SandstormSimulation(canvas, { hazeOpacity: 0 });

// Thick, visibility-reducing haze
new SandstormSimulation(canvas, { hazeOpacity: 0.35 });
```
