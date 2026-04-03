# Confetti API

## `ConfettiSimulation`

Extends [`LimitedFrameRateCanvas`](./general#limitedframeratecanvas).

### Constructor

```typescript
new ConfettiSimulation(canvas: HTMLCanvasElement, config?: ConfettiSimulationConfig)
```

### Methods

#### `fire(config): void`

Fires a burst of confetti particles. All config properties are optional and merged with the [defaults](#defaults).

```typescript
sim.fire(config: Partial<Config>): void
```

#### `start(): void`

Starts the simulation loop. Called automatically by `fire()` if not already running.

#### `stop(): void`

Stops the simulation loop.

#### `destroy(): void`

Stops the simulation and removes all event listeners.

---

## `Config`

Configuration object for a confetti burst.

```typescript
interface Config {
    angle: number;
    colors: string[];
    decay: number;
    gravity: number;
    palette: Palette;
    particles: number;
    shapes: Shape[];
    spread: number;
    startVelocity: number;
    ticks: number;
    x: number;
    y: number;
}
```

| Property        | Type                  | Default       | Description                                               |
|-----------------|-----------------------|---------------|-----------------------------------------------------------|
| `angle`         | `number`              | `90`          | Launch angle in degrees. `90` is straight up.             |
| `colors`        | `string[]`            | —             | Array of hex color strings. Overrides `palette` when set. |
| `decay`         | `number`              | `0.9`         | Velocity decay factor per tick. Lower = faster slowdown.  |
| `gravity`       | `number`              | `1`           | Gravity acceleration. Higher = faster fall.               |
| `palette`       | [`Palette`](#palette) | `'vibrant'`   | Built-in color palette. Ignored when `colors` is set.     |
| `particles`     | `number`              | `50`          | Number of confetti particles to emit.                     |
| `shapes`        | [`Shape[]`](#shape)   | All 11 shapes | Shapes to randomly select from.                           |
| `spread`        | `number`              | `45`          | Spread angle in degrees.                                  |
| `startVelocity` | `number`              | `45`          | Initial particle velocity.                                |
| `ticks`         | `number`              | `200`         | Lifetime in ticks before a particle disappears.           |
| `x`             | `number`              | `0.5`         | Horizontal position (0-1, normalized to canvas width).    |
| `y`             | `number`              | `0.5`         | Vertical position (0-1, normalized to canvas height).     |

All properties are optional when calling `fire()`. Omitted properties use the defaults above.

::: tip
`startVelocity` and `gravity` are automatically scaled by the simulation's `scale` setting.
:::

---

## `ConfettiSimulationConfig`

```typescript
interface ConfettiSimulationConfig {
    scale?: number;
    canvasOptions?: CanvasRenderingContext2DSettings;
}
```

| Property        | Type                               | Default                      | Description                                                 |
|-----------------|------------------------------------|------------------------------|-------------------------------------------------------------|
| `scale`         | `number`                           | `1`                          | Scales particle size, velocity, and gravity proportionally. |
| `canvasOptions` | `CanvasRenderingContext2DSettings` | `{colorSpace: 'display-p3'}` | Options passed to `canvas.getContext('2d')`.                |

---

## `Palette`

A built-in color palette. Use `palette` in config for a quick preset, or provide `colors` to override.

```typescript
type Palette = 'classic' | 'pastel' | 'vibrant' | 'warm';
```

| Palette   | Description                     |
|-----------|---------------------------------|
| `classic` | The original neon color set.    |
| `pastel`  | Soft, muted pastels.            |
| `vibrant` | Bright, modern tones (default). |
| `warm`    | Rich, warm and deep colors.     |

The `PALETTES` constant is exported and maps each palette name to its color array:

```typescript
import { PALETTES } from '@basmilius/sparkle';

console.log(PALETTES.vibrant);
// ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#eab308', '#22c55e', '#06b6d4']
```

---

## `Shape`

The visual shape of a confetti particle.

```typescript
type Shape = 'bowtie' | 'circle' | 'crescent' | 'diamond' | 'heart' | 'hexagon' | 'ribbon' | 'ring' | 'square' | 'star' | 'triangle';
```

---

## Defaults

Default palette: `'vibrant'`

Default shapes:

```typescript
[
    'bowtie', 'circle', 'crescent', 'diamond', 'heart',
    'hexagon', 'ribbon', 'ring', 'square', 'star', 'triangle'
]
```
