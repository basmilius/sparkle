# Glitter API

## `GlitterSimulation`

Extends [`LimitedFrameRateCanvas`](./general#limitedframeratecanvas).

### Constructor

```typescript
new GlitterSimulation(canvas: HTMLCanvasElement, config?: GlitterSimulationConfig)
```

### Methods

#### `start(): void`
Starts the glitter animation.

#### `stop(): void`
Stops the glitter animation.

#### `destroy(): void`
Stops the animation and removes all event listeners.

---

## `GlitterSimulationConfig`

```typescript
interface GlitterSimulationConfig {
    count?: number;
    colors?: string[];
    size?: number;
    speed?: number;
    groundLevel?: number;
    maxSettled?: number;
    scale?: number;
    canvasOptions?: CanvasRenderingContext2DSettings;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `count` | `number` | `80` | Number of falling glitter pieces. Automatically halved on small screens. |
| `colors` | `string[]` | `['#ffd700', '#c0c0c0', '#ff69b4', '#00bfff', '#ff4500', '#7fff00', '#9370db']` | Hex color strings for the glitter pieces. |
| `size` | `number` | `4` | Base glitter piece size in pixels (before scale). |
| `speed` | `number` | `1` | Fall speed multiplier. |
| `groundLevel` | `number` | `0.85` | Normalized Y position (0-1) where glitter settles. |
| `maxSettled` | `number` | `200` | Maximum number of settled pieces on the ground. Oldest pieces are removed when exceeded. |
| `scale` | `number` | `1` | Scales all piece sizes proportionally. |
| `canvasOptions` | `CanvasRenderingContext2DSettings` | `{colorSpace: 'display-p3'}` | Options passed to `canvas.getContext('2d')`. |

---

## `FallingGlitter`

Internal representation of a falling glitter piece.

```typescript
type FallingGlitter = {
    x: number;           // Normalized X position (0-1)
    y: number;           // Normalized Y position (0-1)
    vy: number;          // Vertical velocity
    size: number;        // Piece size in pixels
    rotation: number;    // Current rotation angle
    rotationSpeed: number; // Rotation speed per frame
    flipAngle: number;   // 3D flip angle for depth simulation
    flipSpeed: number;   // Flip rotation speed
    sparkle: number;     // Current sparkle intensity (0-1)
    colorIndex: number;  // Index into the colors array
    settled: boolean;    // Whether the piece has settled
};
```

---

## `SettledGlitter`

Internal representation of a settled glitter piece on the ground.

```typescript
type SettledGlitter = {
    x: number;           // Normalized X position (0-1)
    y: number;           // Normalized Y position (0-1)
    size: number;        // Piece size in pixels
    rotation: number;    // Fixed rotation angle
    sparklePhase: number; // Phase offset for sparkle animation
    sparkleSpeed: number; // Speed of sparkle pulsing
    colorIndex: number;  // Index into the colors array
};
```
