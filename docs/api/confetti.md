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
    particles: number;
    shapes: Shape[];
    spread: number;
    startVelocity: number;
    ticks: number;
    x: number;
    y: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `angle` | `number` | `90` | Launch angle in degrees. `90` is straight up. |
| `colors` | `string[]` | 7 vibrant colors | Array of hex color strings. |
| `decay` | `number` | `0.9` | Velocity decay factor per tick. Lower = faster slowdown. |
| `gravity` | `number` | `1` | Gravity acceleration. Higher = faster fall. |
| `particles` | `number` | `50` | Number of confetti particles to emit. |
| `shapes` | [`Shape[]`](#shape) | All 6 shapes | Shapes to randomly select from. |
| `spread` | `number` | `45` | Spread angle in degrees. |
| `startVelocity` | `number` | `45` | Initial particle velocity. |
| `ticks` | `number` | `200` | Lifetime in ticks before a particle disappears. |
| `x` | `number` | `0.5` | Horizontal position (0-1, normalized to canvas width). |
| `y` | `number` | `0.5` | Vertical position (0-1, normalized to canvas height). |

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

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `scale` | `number` | `1` | Scales particle size, velocity, and gravity proportionally. |
| `canvasOptions` | `CanvasRenderingContext2DSettings` | `{colorSpace: 'display-p3'}` | Options passed to `canvas.getContext('2d')`. |

---

## `Shape`

The visual shape of a confetti particle.

```typescript
type Shape = 'circle' | 'diamond' | 'ribbon' | 'square' | 'star' | 'triangle';
```

---

## Defaults

The default color palette:

```typescript
[
    '#26ccff', '#a25afd', '#ff5e7e',
    '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'
]
```
