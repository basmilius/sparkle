# Sound Waves

The sound waves effect visualizes interference patterns from multiple wave sources. Each source emits circular waves that propagate outward and interfere constructively and destructively with other sources, producing colorful ripple patterns. Clicking the canvas adds a temporary burst source at the click position.

::: render
render=../code/sound-waves/preview.vue
:::

## Examples

::: example Basic || Three wave sources with default blue tones.
example=../code/sound-waves/preview.vue
:::

## Configuration

```typescript
import { createSoundWaves } from '@basmilius/sparkle';

const waves = createSoundWaves({
    speed: 1,
    sources: 3,
    frequency: 1,
    amplitude: 1,
    colors: ['#1e40af', '#0891b2', '#0d9488', '#2563eb', '#06b6d4'],
    resolution: 4,
    damping: 0.98,
    scale: 1
});
waves.mount(canvas).start();
```

### Click Interaction

Clicking anywhere on the canvas adds a temporary wave source at that position. It emits a short burst and then fades out.

### Number of Sources

```typescript
// Minimal interference pattern
createSoundWaves({ sources: 1 });

// Complex multi-source interference
createSoundWaves({ sources: 6 });
```

### Frequency & Amplitude

```typescript
// Long wavelength, gentle ripples
createSoundWaves({ frequency: 0.5, amplitude: 0.8 });

// Short wavelength, tight ripples
createSoundWaves({ frequency: 2, amplitude: 1.5 });
```

### Damping

Controls how quickly waves fade with distance from the source:

```typescript
// Sharp falloff, localized patterns
createSoundWaves({ damping: 0.9 });

// Slow falloff, wide-reaching interference
createSoundWaves({ damping: 0.999 });
```

### Colors

Each source is assigned one of the provided colors:

```typescript
// Warm palette
createSoundWaves({ colors: ['#f97316', '#eab308', '#ef4444'] });
```
