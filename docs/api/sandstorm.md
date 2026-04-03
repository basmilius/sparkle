# Sandstorm API

## `SandstormSimulation`

Extends [`LimitedFrameRateCanvas`](./general#limitedframeratecanvas).

### Constructor

```typescript
new SandstormSimulation(canvas: HTMLCanvasElement, config?: SandstormSimulationConfig)
```

### Methods

#### `start(): void`
Starts the sandstorm animation.

#### `stop(): void`
Stops the sandstorm animation.

#### `destroy(): void`
Stops the animation and removes all event listeners.

---

## `SandstormSimulationConfig`

```typescript
interface SandstormSimulationConfig {
    count?: number;
    wind?: number;
    turbulence?: number;
    color?: string;
    hazeOpacity?: number;
    scale?: number;
    canvasOptions?: CanvasRenderingContext2DSettings;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `count` | `number` | `300` | Number of sand grains. Halved on small screens. |
| `wind` | `number` | `1` | Horizontal wind strength multiplier. |
| `turbulence` | `number` | `1` | Chaotic movement intensity. |
| `color` | `string` | `'#c2956b'` | CSS color string for sand and haze. |
| `hazeOpacity` | `number` | `0.15` | Opacity of the atmospheric haze overlay (0-1). |
| `scale` | `number` | `1` | Scales grain sizes proportionally. |
| `canvasOptions` | `CanvasRenderingContext2DSettings` | `{colorSpace: 'display-p3'}` | Options passed to `canvas.getContext('2d')`. |

---

## `SandGrain`

Internal representation of a sand particle.

```typescript
type SandGrain = {
    x: number;       // Normalized X position (0-1)
    y: number;       // Normalized Y position (0-1)
    vx: number;      // Horizontal velocity
    vy: number;      // Vertical velocity
    size: number;    // Grain size in pixels
    depth: number;   // Depth layer (0.2-1) for parallax
    opacity: number; // Base opacity (0.3-0.8)
};
```
