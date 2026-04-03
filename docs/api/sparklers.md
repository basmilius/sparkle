# Sparklers API

## `Sparklers`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createSparklers(config?: SparklersConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

#### `moveTo(x: number, y: number): void`

Manually sets the emission point. Coordinates are normalized (0-1).

| Parameter | Type     | Description                                 |
|-----------|----------|---------------------------------------------|
| `x`       | `number` | Normalized X position (0 = left, 1 = right) |
| `y`       | `number` | Normalized Y position (0 = top, 1 = bottom) |

---

## `SparklersConfig`

```typescript
interface SparklersConfig {
    emitRate?: number;
    maxSparks?: number;
    colors?: string[];
    speed?: [number, number];
    friction?: number;
    gravity?: number;
    decay?: [number, number];
    trailLength?: number;
    hoverMode?: boolean;
    scale?: number;
}
```

| Property     | Type               | Default                                        | Description                                   |
|--------------|--------------------|------------------------------------------------|-----------------------------------------------|
| `emitRate`   | `number`           | `8`                                            | Number of sparks emitted per frame.           |
| `maxSparks`  | `number`           | `300`                                          | Maximum number of alive sparks.               |
| `colors`     | `string[]`         | `['#ffcc33', '#ff9900', '#ffffff', '#ffee88']` | Spark colors (hex strings).                   |
| `speed`      | `[number, number]` | `[2, 8]`                                       | Min/max initial spark speed.                  |
| `friction`   | `number`           | `0.96`                                         | Speed decay per frame (0-1).                  |
| `gravity`    | `number`           | `0.8`                                          | Downward acceleration per frame.              |
| `decay`      | `[number, number]` | `[0.02, 0.05]`                                 | Min/max alpha decay per frame.                |
| `trailLength`| `number`           | `3`                                            | Number of trail points per spark.             |
| `hoverMode`  | `boolean`          | `false`                                        | When true, emission follows the mouse cursor. |
| `scale`      | `number`           | `1`                                            | Global scale factor.                          |

---

## `Spark`

Internal representation of a spark particle.

```typescript
type Spark = {
    x: number;    // X position in pixels
    y: number;    // Y position in pixels
    vx: number;   // Horizontal velocity
    vy: number;   // Vertical velocity
    alpha: number; // Current opacity (0-1)
    color: [number, number, number]; // RGB color
    size: number;  // Radius in pixels
    decay: number; // Alpha decay per frame
    trail: Point[]; // Trail positions
};
```
