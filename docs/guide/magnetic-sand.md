# Magnetic Sand

The magnetic sand effect simulates iron filings on a surface responding to a magnetic field. Particles drift in gentle dune-like patterns at rest, but when you hover the mouse over the canvas, they cluster into radial spike formations — just like iron filings aligning along magnetic field lines.

::: render
render=../code/magnetic-sand/preview.vue
:::

## Examples

::: example Basic || Default magnetic sand with dark particles.
example=../code/magnetic-sand/preview.vue
:::

## Configuration

```typescript
import { createMagneticSand } from '@basmilius/sparkle';

const sand = createMagneticSand({
    speed: 1,
    count: 600,
    color: '#1a1a1a',
    magnetStrength: 1,
    scale: 1
});
sand.mount(canvas).start();
```

### Mouse Interaction

Hovering the mouse over the canvas acts as a magnetic pole. Particles within range align into eight radial spikes. Moving the mouse away causes them to gradually relax back into dune formations.

### Particle Count

```typescript
// Sparse, scattered grains
createMagneticSand({ count: 200 });

// Dense sand sheet
createMagneticSand({ count: 1200 });
```

### Magnet Strength

```typescript
// Weak attraction, loose formations
createMagneticSand({ magnetStrength: 0.4 });

// Strong attraction, sharp spikes
createMagneticSand({ magnetStrength: 2 });
```

### Color

```typescript
// Light sand on dark background
createMagneticSand({ color: '#d4a96a' });

// Metallic filings
createMagneticSand({ color: '#888888' });
```
