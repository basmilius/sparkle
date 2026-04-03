# Lightning

The lightning simulation renders dramatic lightning bolts that strike from the top of the canvas downward. Each bolt zigzags with random horizontal offsets and can spawn smaller branches at angles. An optional screen flash briefly illuminates the canvas for extra impact.

::: render
render=../code/lightning/preview.vue
:::

## Examples

::: example Default || Lightning bolts with branches and subtle screen flash.
example=../code/lightning/preview.vue
:::

::: example Storm || Frequent lightning strikes with intense flashes.
example=../code/lightning/storm.vue
:::

## Configuration

All options are passed via a config object:

```typescript
import { LightningSimulation } from '@basmilius/sparkle';

const sim = new LightningSimulation(canvas, {
    frequency: 2,
    color: '#b4c8ff',
    branches: true,
    flash: true,
    scale: 1
});
sim.start();
```

### Frequency

Control how often bolts spawn. Higher values mean more frequent strikes:

```typescript
// Rare bolts (roughly every 6 seconds)
new LightningSimulation(canvas, { frequency: 0.5 });

// Frequent storm
new LightningSimulation(canvas, { frequency: 3 });
```

### Branches

Enable or disable smaller branch bolts that fork off the main bolt:

```typescript
// Clean bolts without branches
new LightningSimulation(canvas, { branches: false });

// With branches (default)
new LightningSimulation(canvas, { branches: true });
```

### Flash

Toggle the brief white screen flash when a bolt strikes:

```typescript
// No screen flash
new LightningSimulation(canvas, { flash: false });

// With flash (default)
new LightningSimulation(canvas, { flash: true });
```

### Color

Customize the bolt color:

```typescript
// Default blue-white
new LightningSimulation(canvas, { color: '#b4c8ff' });

// Purple lightning
new LightningSimulation(canvas, { color: '#c8a0ff' });

// Warm golden
new LightningSimulation(canvas, { color: '#ffe080' });
```
