# Firepit

The firepit simulation creates a warm campfire effect with flickering flames, rising embers, and a soft ambient glow. Each ember rises with a unique trajectory and fades out naturally.

::: render
render=../code/firepit/preview.vue
:::

## Examples

::: example Campfire || A cozy campfire with default settings.
example=../code/firepit/preview.vue
:::

::: example Intense blaze || A roaring fire with more embers and taller flames.
example=../code/firepit/intense.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { FirepitSimulation } from '@basmilius/sparkle';

const sim = new FirepitSimulation(canvas, {
    embers: 60,
    flameWidth: 0.4,
    flameHeight: 0.35,
    intensity: 1,
    scale: 1
});
sim.start();
```

### Embers

Control the number of rising ember particles:

```typescript
// Subtle, few embers
new FirepitSimulation(canvas, { embers: 20 });

// Lots of sparks
new FirepitSimulation(canvas, { embers: 150 });
```

### Intensity

Scale the overall brightness and activity:

```typescript
// Dying fire
new FirepitSimulation(canvas, { intensity: 0.4 });

// Blazing bonfire
new FirepitSimulation(canvas, { intensity: 2 });
```

### Flame Size

Control the flame dimensions (as fraction of canvas):

```typescript
// Narrow, tall flame
new FirepitSimulation(canvas, { flameWidth: 0.2, flameHeight: 0.5 });

// Wide, short flame
new FirepitSimulation(canvas, { flameWidth: 0.6, flameHeight: 0.2 });
```
