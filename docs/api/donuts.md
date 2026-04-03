# Donuts API

## `DonutSimulation`

Extends [`LimitedFrameRateCanvas`](./general#limitedframeratecanvas).

### Constructor

```typescript
new DonutSimulation(canvas: HTMLCanvasElement, config?: DonutSimulationConfig)
```

### Methods

#### `start(): void`

Initializes the donuts and starts the animation loop.

#### `stop(): void`

Stops the animation loop.

#### `destroy(): void`

Stops the animation and removes all event listeners.

---

## `DonutSimulationConfig`

```typescript
interface DonutSimulationConfig {
    background?: string;
    canvasOptions?: CanvasRenderingContext2DSettings;
    collisionPadding?: number;
    colors?: string[];
    count?: number;
    mouseAvoidance?: boolean;
    mouseAvoidanceRadius?: number;
    mouseAvoidanceStrength?: number;
    radiusRange?: [number, number];
    repulsionStrength?: number;
    rotationSpeedRange?: [number, number];
    scale?: number;
    speedRange?: [number, number];
    thickness?: number;
}
```

| Property                 | Type                               | Default                      | Description                                                                         |
|--------------------------|------------------------------------|------------------------------|-------------------------------------------------------------------------------------|
| `background`             | `string`                           | `'#a51955'`                  | Canvas background fill color.                                                       |
| `canvasOptions`          | `CanvasRenderingContext2DSettings` | `{colorSpace: 'display-p3'}` | Options passed to `canvas.getContext('2d')`.                                        |
| `collisionPadding`       | `number`                           | `20`                         | Minimum spacing between donut edges in pixels.                                      |
| `colors`                 | `string[]`                         | `['#bd1961', '#da287c']`     | Fill colors for the donuts. Each donut picks a random color.                        |
| `count`                  | `number`                           | `12`                         | Number of donuts on screen.                                                         |
| `mouseAvoidance`         | `boolean`                          | `false`                      | When enabled, donuts move away from the mouse cursor.                               |
| `mouseAvoidanceRadius`   | `number`                           | `150`                        | Distance in pixels within which donuts are repelled from the cursor (before scale). |
| `mouseAvoidanceStrength` | `number`                           | `0.03`                       | How strongly donuts are repelled from the cursor. Higher = stronger avoidance.      |
| `radiusRange`            | `[number, number]`                 | `[60, 90]`                   | Outer radius range `[min, max]` in pixels (before scale).                           |
| `repulsionStrength`      | `number`                           | `0.02`                       | How strongly donuts repel each other. Higher = snappier avoidance.                  |
| `rotationSpeedRange`     | `[number, number]`                 | `[0.0005, 0.002]`            | Rotation speed range `[min, max]` in radians per frame.                             |
| `scale`                  | `number`                           | `1`                          | Scales donut radius, speed, and collision padding proportionally.                   |
| `speedRange`             | `[number, number]`                 | `[0.15, 0.6]`                | Movement speed range `[min, max]` in pixels per frame (before scale).               |
| `thickness`              | `number`                           | `0.39`                       | Ring thickness as a fraction of the outer radius (0–1).                             |

---

## `Donut`

Internal representation of a donut particle.

```typescript
type Donut = {
    outerRadius: number;  // Outer circle radius in pixels
    innerRadius: number;  // Inner circle radius in pixels
    x: number;            // X position in pixels
    y: number;            // Y position in pixels
    angle: number;        // Current rotation angle in radians
    speed: number;        // Base movement speed
    rotationSpeed: number; // Rotation speed in radians per frame
    color: string;        // Fill color
    vx: number;           // X velocity
    vy: number;           // Y velocity
};
```
