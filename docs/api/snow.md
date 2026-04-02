# Snow API

## `SnowSimulation`

Extends [`LimitedFrameRateCanvas`](./general#limitedframeratecanvas).

### Constructor

```typescript
new SnowSimulation(canvas: HTMLCanvasElement, config?: SnowSimulationConfig)
```

### Methods

#### `start(): void`
Starts the snowfall animation.

#### `stop(): void`
Stops the snowfall animation.

#### `destroy(): void`
Stops the animation and removes all event listeners.

---

## `SnowSimulationConfig`

```typescript
interface SnowSimulationConfig {
    fillStyle?: string;
    particles?: number;
    scale?: number;
    size?: number;
    speed?: number;
    canvasOptions?: CanvasRenderingContext2DSettings;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `fillStyle` | `string` | `'rgb(255 255 255 / .75)'` | CSS color string for the snowflake fill. |
| `particles` | `number` | `200` | Number of snowflakes. Automatically halved on small screens. |
| `scale` | `number` | `1` | Scales all snowflake sizes proportionally. |
| `size` | `number` | `6` | Maximum snowflake radius in pixels (before scale). |
| `speed` | `number` | `2` | Fall speed multiplier. |
| `canvasOptions` | `CanvasRenderingContext2DSettings` | `{colorSpace: 'display-p3'}` | Options passed to `canvas.getContext('2d')`. |

---

## `Snowflake`

Internal representation of a snowflake particle.

```typescript
interface Snowflake {
    x: number;       // Normalized X position (0-1)
    y: number;       // Normalized Y position (0-1)
    density: number;  // Controls the wave/swing pattern
    radius: number;   // Visual radius in pixels
}
```
