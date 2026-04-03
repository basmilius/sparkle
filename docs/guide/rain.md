# Rain

The rain simulation creates falling raindrops with optional splash effects on impact. Choose from three variants: a gentle drizzle, a heavy downpour, or a driving thunderstorm. Combine with `LightningLayer` via `LayeredSimulation` for lightning effects.

::: render
render=../code/rain/preview.vue
:::

## Examples

::: example Downpour || Heavy rain with splash effects on impact.
example=../code/rain/preview.vue
:::

::: example Thunderstorm || Very heavy rain with strong wind and splashes.
example=../code/rain/thunderstorm.vue
:::

::: example Wind || Rain falling at an angle with horizontal wind.
example=../code/rain/wind.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { RainSimulation } from '@basmilius/sparkle';

const sim = new RainSimulation(canvas, {
    variant: 'thunderstorm',
    drops: 400,
    wind: 0.3,
    speed: 1.2,
    scale: 1
});
sim.start();
```

### Variants

Choose a rain intensity preset:

```typescript
// Light drizzle, no splashes
new RainSimulation(canvas, { variant: 'drizzle' });

// Heavy rain with splashes
new RainSimulation(canvas, { variant: 'downpour' });

// Very heavy rain with strong wind
new RainSimulation(canvas, { variant: 'thunderstorm' });
```

### Wind

Add horizontal wind to angle the rain:

```typescript
// Gentle left-to-right wind
new RainSimulation(canvas, { wind: 0.3 });

// Strong right-to-left wind
new RainSimulation(canvas, { wind: -0.8 });
```

### Ground Level

Control where raindrops hit the ground:

```typescript
// Rain stops at 80% of the canvas height
new RainSimulation(canvas, { groundLevel: 0.8 });

// Rain falls to the very bottom
new RainSimulation(canvas, { groundLevel: 1.0 });
```
