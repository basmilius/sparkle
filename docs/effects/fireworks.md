# Fireworks

The fireworks simulation creates a continuous firework display with 16 unique explosion variants, 3D depth effects, and configurable scale.

## Basic Usage

```typescript
import { FireworkSimulation } from '@basmilius/effects';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const sim = new FireworkSimulation(canvas);
sim.start();
```

## Configuration

The constructor accepts an optional config object:

```typescript
const sim = new FireworkSimulation(canvas, {
    scale: 1,         // Overall size multiplier (default: 1)
    autoSpawn: true    // Automatically launch fireworks (default: true)
});
```

| Option          | Type                               | Default                      | Description                                                                                      |
|-----------------|------------------------------------|------------------------------|--------------------------------------------------------------------------------------------------|
| `scale`         | `number`                           | `1`                          | Scales all particle sizes, trail widths, and glow proportionally.                                |
| `autoSpawn`     | `boolean`                          | `true`                       | When `false`, no fireworks are launched automatically. Use `fireExplosion()` for manual control. |
| `canvasOptions` | `CanvasRenderingContext2DSettings` | `{colorSpace: 'display-p3'}` | Options passed to `canvas.getContext('2d')`.                                                     |

## Manual Explosions

Fire a specific explosion variant at a given position:

```typescript
import type { FireworkVariant } from '@basmilius/effects';

const sim = new FireworkSimulation(canvas, { autoSpawn: false });
sim.start();

// Fire a saturn explosion at a specific position
sim.fireExplosion('saturn', { x: 500, y: 300 });

// Fire at the default position (center, 40% height)
sim.fireExplosion('heart');
```

## Available Variants

Use `FIREWORK_VARIANTS` to get the full list at runtime:

```typescript
import { FIREWORK_VARIANTS } from '@basmilius/effects';

console.log(FIREWORK_VARIANTS);
// ['peony', 'chrysanthemum', 'willow', 'ring', ...]
```

See [Variants](/fireworks/variants) for a detailed breakdown of each variant.
