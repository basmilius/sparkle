# Rain

The rain simulation creates falling raindrops with optional splash effects on impact. Choose from three variants: a gentle drizzle, a heavy downpour, or a driving thunderstorm. Combine with `Lightning` via `Scene` for lightning effects.

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
import { createRain } from '@basmilius/sparkle';

const rain = createRain({
    variant: 'thunderstorm',
    drops: 400,
    wind: 0.3,
    speed: 1.2,
    scale: 1
});
rain.mount(canvas).start();
```

### Variants

Choose a rain intensity preset:

```typescript
// Light drizzle, no splashes
createRain({ variant: 'drizzle' });

// Heavy rain with splashes
createRain({ variant: 'downpour' });

// Very heavy rain with strong wind
createRain({ variant: 'thunderstorm' });
```

### Wind

Add horizontal wind to angle the rain:

```typescript
// Gentle left-to-right wind
createRain({ wind: 0.3 });

// Strong right-to-left wind
createRain({ wind: -0.8 });
```

### Ground Level

Control where raindrops hit the ground:

```typescript
// Rain stops at 80% of the canvas height
createRain({ groundLevel: 0.8 });

// Rain falls to the very bottom
createRain({ groundLevel: 1.0 });
```
