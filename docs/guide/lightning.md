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
import { createLightning } from '@basmilius/sparkle';

const lightning = createLightning({
    frequency: 2,
    color: '#b4c8ff',
    branches: true,
    flash: true,
    scale: 1
});
lightning.mount(canvas).start();
```

### Frequency

Control how often bolts spawn. Higher values mean more frequent strikes:

```typescript
// Rare bolts (roughly every 6 seconds)
createLightning({ frequency: 0.5 });

// Frequent storm
createLightning({ frequency: 3 });
```

### Branches

Enable or disable smaller branch bolts that fork off the main bolt:

```typescript
// Clean bolts without branches
createLightning({ branches: false });

// With branches (default)
createLightning({ branches: true });
```

### Flash

Toggle the brief white screen flash when a bolt strikes:

```typescript
// No screen flash
createLightning({ flash: false });

// With flash (default)
createLightning({ flash: true });
```

### Color

Customize the bolt color:

```typescript
// Default blue-white
createLightning({ color: '#b4c8ff' });

// Purple lightning
createLightning({ color: '#c8a0ff' });

// Warm golden
createLightning({ color: '#ffe080' });
```
