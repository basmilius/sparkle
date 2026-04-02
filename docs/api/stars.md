# Stars API

## `StarSimulation`

Extends [`LimitedFrameRateCanvas`](./general#limitedframeratecanvas).

### Constructor

```typescript
new StarSimulation(canvas: HTMLCanvasElement, config?: StarSimulationConfig)
```

### Methods

#### `start(): void`
Starts the star animation.

#### `stop(): void`
Stops the star animation.

#### `destroy(): void`
Stops the animation and removes all event listeners.

---

## `StarSimulationConfig`

```typescript
interface StarSimulationConfig {
    mode?: StarMode;
    starCount?: number;
    shootingInterval?: [number, number];
    shootingSpeed?: number;
    twinkleSpeed?: number;
    color?: string;
    shootingColor?: string;
    trailLength?: number;
    scale?: number;
    canvasOptions?: CanvasRenderingContext2DSettings;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `mode` | `StarMode` | `'both'` | Which layers to display. |
| `starCount` | `number` | `150` | Number of twinkling background stars. Automatically halved on small screens. |
| `shootingInterval` | `[number, number]` | `[120, 360]` | Tick range between shooting star spawns. |
| `shootingSpeed` | `number` | `1` | Shooting star speed multiplier. |
| `twinkleSpeed` | `number` | `1` | Twinkle animation speed multiplier. |
| `color` | `string` | `'#ffffff'` | Star color (hex string). |
| `shootingColor` | `string` | `'#ffffff'` | Shooting star color (hex string). |
| `trailLength` | `number` | `15` | Number of trail points per shooting star. |
| `scale` | `number` | `1` | Global scale factor. |
| `canvasOptions` | `CanvasRenderingContext2DSettings` | `{colorSpace: 'display-p3'}` | Options passed to `canvas.getContext('2d')`. |

---

## `StarMode`

```typescript
type StarMode = 'sky' | 'shooting' | 'both';
```

| Mode | Description |
|------|-------------|
| `sky` | Only twinkling background stars. |
| `shooting` | Only shooting stars with trails. |
| `both` | Both twinkling stars and shooting stars. |

---

## `Star`

Internal representation of a background star.

```typescript
type Star = {
    x: number;           // Normalized X position (0-1)
    y: number;           // Normalized Y position (0-1)
    size: number;        // Radius in pixels
    twinklePhase: number; // Phase offset for twinkle
    twinkleSpeed: number; // Individual twinkle speed
    brightness: number;   // Base brightness (0-1)
};
```

---

## `ShootingStar`

Internal representation of a shooting star.

```typescript
type ShootingStar = {
    x: number;    // X position in pixels
    y: number;    // Y position in pixels
    vx: number;   // Horizontal velocity
    vy: number;   // Vertical velocity
    alpha: number; // Current opacity
    size: number;  // Head radius
    decay: number; // Alpha decay per frame
    trail: {x: number; y: number}[]; // Trail positions
};
```
