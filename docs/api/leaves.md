# Leaves API

## `LeafSimulation`

Extends [`LimitedFrameRateCanvas`](./general#limitedframeratecanvas).

### Constructor

```typescript
new LeafSimulation(canvas: HTMLCanvasElement, config?: LeafSimulationConfig)
```

### Methods

#### `start(): void`

Starts the leaf animation.

#### `stop(): void`

Stops the leaf animation.

#### `destroy(): void`

Stops the animation and removes all event listeners.

---

## `LeafSimulationConfig`

```typescript
interface LeafSimulationConfig {
    count?: number;
    colors?: string[];
    size?: number;
    speed?: number;
    wind?: number;
    scale?: number;
    canvasOptions?: CanvasRenderingContext2DSettings;
}
```

| Property        | Type                               | Default                      | Description                                                  |
|-----------------|------------------------------------|------------------------------|--------------------------------------------------------------|
| `count`         | `number`                           | `80`                         | Number of leaves. Automatically halved on small screens.     |
| `colors`        | `string[]`                         | Autumn palette (10 colors)   | Array of CSS color strings for leaf colors.                  |
| `size`          | `number`                           | `14`                         | Maximum leaf size in pixels (before scale).                  |
| `speed`         | `number`                           | `1`                          | Fall speed multiplier.                                       |
| `wind`          | `number`                           | `0.3`                        | Horizontal wind strength. Positive = right, negative = left. |
| `scale`         | `number`                           | `1`                          | Scales all leaf sizes proportionally.                        |
| `canvasOptions` | `CanvasRenderingContext2DSettings` | `{colorSpace: 'display-p3'}` | Options passed to `canvas.getContext('2d')`.                 |

---

## `Leaf`

Internal representation of a leaf particle.

```typescript
type Leaf = {
    x: number;          // Normalized X position (0-1)
    y: number;          // Normalized Y position (0-1)
    size: number;       // Leaf size in pixels
    depth: number;      // Depth layer (0.3-1) for parallax
    rotation: number;   // Current rotation angle
    rotationSpeed: number; // Rotation speed
    flipAngle: number;  // 3D flip angle for tumbling
    flipSpeed: number;  // Flip rotation speed
    shape: number;      // Leaf shape variant (0-2)
    colorIndex: number; // Index into sprite array
};
```
