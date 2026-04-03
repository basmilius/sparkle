# Fireflies API

## `FireflySimulation`

Extends [`LimitedFrameRateCanvas`](./general#limitedframeratecanvas).

### Constructor

```typescript
new FireflySimulation(canvas: HTMLCanvasElement, config?: FireflySimulationConfig)
```

### Methods

#### `start(): void`

Starts the firefly animation.

#### `stop(): void`

Stops the firefly animation.

#### `destroy(): void`

Stops the animation and removes all event listeners.

---

## `FireflySimulationConfig`

```typescript
interface FireflySimulationConfig {
    count?: number;
    color?: string;
    size?: number;
    speed?: number;
    glowSpeed?: number;
    scale?: number;
    canvasOptions?: CanvasRenderingContext2DSettings;
}
```

| Property        | Type                               | Default                      | Description                                                 |
|-----------------|------------------------------------|------------------------------|-------------------------------------------------------------|
| `count`         | `number`                           | `60`                         | Number of fireflies. Automatically halved on small screens. |
| `color`         | `string`                           | `'#b4ff6a'`                  | CSS color string for the glow color.                        |
| `size`          | `number`                           | `6`                          | Maximum glow radius in pixels (before scale).               |
| `speed`         | `number`                           | `1`                          | Movement speed multiplier.                                  |
| `glowSpeed`     | `number`                           | `1`                          | Glow pulsing speed multiplier.                              |
| `scale`         | `number`                           | `1`                          | Scales all firefly sizes proportionally.                    |
| `canvasOptions` | `CanvasRenderingContext2DSettings` | `{colorSpace: 'display-p3'}` | Options passed to `canvas.getContext('2d')`.                |

---

## `Firefly`

Internal representation of a firefly particle.

```typescript
type Firefly = {
    x: number;       // Normalized X position (0-1)
    y: number;       // Normalized Y position (0-1)
    size: number;    // Glow radius in pixels
    phase: number;   // Glow phase offset
    glowSpeed: number; // Individual glow speed
};
```
