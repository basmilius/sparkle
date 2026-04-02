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
| `bands` | `number` | `4` | Number of aurora bands. |
| `colors` | `string[]` | `['#00ff88', '#00aaff', '#8844ff', '#ff44aa']` | Base hex colors for each band. Colors cycle if fewer than bands. |
| `speed` | `number` | `1` | Animation speed multiplier. |
| `intensity` | `number` | `0.6` | Overall brightness/opacity (0-1). |
| `waveAmplitude` | `number` | `1` | Undulation amplitude multiplier. |
| `verticalPosition` | `number` | `0.3` | Normalized Y center for the aurora (0=top, 1=bottom). |
| `scale` | `number` | `1` | Global scale factor. |
| `canvasOptions` | `CanvasRenderingContext2DSettings` | `{colorSpace: 'display-p3'}` | Options passed to `canvas.getContext('2d')`. |

---

## `AuroraBand`

Internal representation of a single aurora band.

```typescript
type AuroraBand = {
    baseY: number;      // Normalized base Y position
    hue: number;        // HSL hue value (0-360)
    amplitude1: number; // Primary wave amplitude in pixels
    frequency1: number; // Primary wave frequency
    phase1: number;     // Primary wave phase
    amplitude2: number; // Secondary wave amplitude in pixels
    frequency2: number; // Secondary wave frequency
    phase2: number;     // Secondary wave phase
    speed: number;      // Individual animation speed
    width: number;      // Band width in pixels
    opacity: number;    // Band opacity
};
```
