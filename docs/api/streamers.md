# Streamers API

## `StreamerSimulation`

Extends [`LimitedFrameRateCanvas`](./general#limitedframeratecanvas).

### Constructor

```typescript
new StreamerSimulation(canvas: HTMLCanvasElement, config?: StreamerSimulationConfig)
```

### Methods

#### `start(): void`
Starts the streamers animation.

#### `stop(): void`
Stops the streamers animation.

#### `destroy(): void`
Stops the animation and removes all event listeners.

---

## `StreamerSimulationConfig`

```typescript
interface StreamerSimulationConfig {
    count?: number;
    colors?: string[];
    speed?: number;
    scale?: number;
    canvasOptions?: CanvasRenderingContext2DSettings;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `count` | `number` | `20` | Number of streamers. Automatically halved on small screens. |
| `colors` | `string[]` | `STREAMER_COLORS` | Array of hex color strings for the streamers. |
| `speed` | `number` | `1` | Fall speed multiplier. Higher values make streamers fall faster. |
| `scale` | `number` | `1` | Scales streamer sizes, widths, and physics proportionally. |
| `canvasOptions` | `CanvasRenderingContext2DSettings` | `{colorSpace: 'display-p3'}` | Options passed to `canvas.getContext('2d')`. |

---

## `Streamer`

Internal representation of a single streamer ribbon.

```typescript
type Streamer = {
    x: number;            // Head X position in pixels
    y: number;            // Head Y position in pixels
    length: number;       // Total ribbon length in pixels
    width: number;        // Base ribbon width in pixels
    segments: {x: number; y: number}[]; // Points forming the ribbon path
    fallSpeed: number;    // Vertical fall speed per frame
    swayPhase: number;    // Current phase of the sway oscillation
    swaySpeed: number;    // Speed of the sway oscillation
    swayAmplitude: number; // Horizontal sway distance
    color: string;        // Hex color string
    curl: number;         // Curl intensity affecting wave shape
    depth: number;        // Parallax depth (0.4-1), affects size and opacity
};
```
