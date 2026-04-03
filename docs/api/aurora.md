# Aurora API

## `AuroraSimulation`

Extends [`LimitedFrameRateCanvas`](./general#limitedframeratecanvas).

### Constructor

```typescript
new AuroraSimulation(canvas: HTMLCanvasElement, config?: AuroraSimulationConfig)
```

### Methods

#### `start(): void`
Starts the aurora animation.

#### `stop(): void`
Stops the aurora animation.

#### `destroy(): void`
Stops the animation and removes all event listeners.

---

## `AuroraSimulationConfig`

```typescript
interface AuroraSimulationConfig {
    bands?: number;
    colors?: string[];
    speed?: number;
    intensity?: number;
    waveAmplitude?: number;
    verticalPosition?: number;
    scale?: number;
    canvasOptions?: CanvasRenderingContext2DSettings;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `bands` | `number` | `5` | Number of aurora curtain rays. |
| `colors` | `string[]` | `['#9922ff', '#4455ff', '#0077ee', '#00aabb', '#22ddff']` | Base hex colors for each ray. Colors cycle if fewer than bands. |
| `speed` | `number` | `1` | Animation speed multiplier. |
| `intensity` | `number` | `0.8` | Overall brightness/opacity (0-1). |
| `waveAmplitude` | `number` | `1` | Base wave undulation amplitude multiplier. |
| `verticalPosition` | `number` | `0.68` | Normalized Y base for the aurora rays (0=top, 1=bottom). |
| `scale` | `number` | `1` | Global scale factor for ray height. |
| `shootingStars` | `boolean` | `true` | Enable occasional shooting stars. |
| `shootingInterval` | `[number, number]` | `[300, 600]` | Min/max frames between shooting stars. |
| `canvasOptions` | `CanvasRenderingContext2DSettings` | `{colorSpace: 'display-p3'}` | Options passed to `canvas.getContext('2d')`. |

---

## `AuroraBand`

Internal representation of a single aurora band.

```typescript
type AuroraBand = {
    x: number;          // Normalized X position of the ray center (0-1)
    baseY: number;      // Normalized Y base of the ray (0-1)
    height: number;     // Normalized ray height (0-1, relative to canvas height)
    sigma: number;      // Horizontal Gaussian spread in pixels (at 1920px width)
    phase1: number;     // Sway oscillation phase
    phase2: number;     // Base wave oscillation phase
    amplitude1: number; // Sway amplitude (fraction of canvas width)
    frequency1: number; // Base wave spatial frequency (rad/px)
    speed: number;      // Individual animation speed multiplier
    hue: number;        // Primary (bottom) hue in HSL (0-360)
    opacity: number;    // Maximum opacity for this ray
};
```
