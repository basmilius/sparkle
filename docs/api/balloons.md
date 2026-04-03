# Balloons API

## `Balloons`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createBalloons(config?: BalloonsConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `BalloonsConfig`

```typescript
interface BalloonsConfig {
    count?: number;
    colors?: string[];
    sizeRange?: [number, number];
    speed?: number;
    driftAmount?: number;
    stringLength?: number;
    scale?: number;
}
```

| Property       | Type               | Default                                                              | Description                                                |
|----------------|--------------------|----------------------------------------------------------------------|------------------------------------------------------------|
| `count`        | `number`           | `15`                                                                 | Number of balloons. Automatically halved on small screens. |
| `colors`       | `string[]`         | `['#ff4444', '#4488ff', '#44cc44', '#ffcc00', '#ff88cc', '#8844ff']` | Balloon fill colors (hex strings).                         |
| `sizeRange`    | `[number, number]` | `[25, 45]`                                                           | Min/max balloon radius in pixels (before scale).           |
| `speed`        | `number`           | `1`                                                                  | Rise speed multiplier.                                     |
| `driftAmount`  | `number`           | `1`                                                                  | Horizontal drift intensity multiplier.                     |
| `stringLength` | `number`           | `1`                                                                  | String length multiplier.                                  |
| `scale`        | `number`           | `1`                                                                  | Scales all sizes proportionally.                           |

---

## `Balloon`

Internal representation of a balloon.

```typescript
type Balloon = {
    x: number;           // Normalized X position (0-1)
    y: number;           // Normalized Y position (0-1)
    radiusX: number;     // Horizontal radius in pixels
    radiusY: number;     // Vertical radius in pixels
    color: [number, number, number]; // RGB color
    driftPhase: number;  // Drift oscillation phase
    driftFreq: number;   // Drift frequency
    driftAmp: number;    // Drift amplitude
    riseSpeed: number;   // Individual rise speed
    rotation: number;    // Current rotation angle
    rotationSpeed: number; // Rotation oscillation speed
    stringLength: number;  // String length in pixels
};
```
