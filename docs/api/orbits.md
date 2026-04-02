# Orbits API

## `OrbitSimulation`

Extends [`LimitedFrameRateCanvas`](./general#limitedframeratecanvas).

### Constructor

```typescript
new OrbitSimulation(canvas: HTMLCanvasElement, config?: OrbitSimulationConfig)
```

### Methods

#### `start(): void`
Initializes centers and orbiters, then starts the animation loop.

#### `stop(): void`
Stops the animation loop.

#### `destroy(): void`
Stops the animation and removes all event listeners.

---

## `OrbitSimulationConfig`

```typescript
interface OrbitSimulationConfig {
    centers?: number;
    orbitersPerCenter?: number;
    speed?: number;
    colors?: string[];
    trailLength?: number;
    showCenters?: boolean;
    scale?: number;
    canvasOptions?: CanvasRenderingContext2DSettings;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `centers` | `number` | `3` | Number of orbital center points. |
| `orbitersPerCenter` | `number` | `8` | Number of particles per center. Automatically halved on small screens. |
| `speed` | `number` | `1` | Orbital speed multiplier. |
| `colors` | `string[]` | `ORBIT_COLORS` | Array of hex color strings for the orbiters. |
| `trailLength` | `number` | `15` | Number of trail segments behind each orbiter. |
| `showCenters` | `boolean` | `true` | Whether to draw a subtle glow at each center point. |
| `scale` | `number` | `1` | Scales orbit radii and particle sizes proportionally. |
| `canvasOptions` | `CanvasRenderingContext2DSettings` | `{colorSpace: 'display-p3'}` | Options passed to `canvas.getContext('2d')`. |

---

## `OrbitalCenter`

Represents a center point for orbiting particles.

```typescript
type OrbitalCenter = {
    x: number;  // Normalized X position (0-1)
    y: number;  // Normalized Y position (0-1)
};
```

---

## `Orbiter`

Represents a single orbiting particle.

```typescript
type Orbiter = {
    centerIndex: number;   // Index of the center this orbiter belongs to
    angle: number;         // Current angle in radians
    angularSpeed: number;  // Rotation speed in radians per frame
    radiusX: number;       // Horizontal orbit radius in pixels
    radiusY: number;       // Vertical orbit radius in pixels
    tilt: number;          // Orbit plane tilt for 3D perspective
    size: number;          // Particle radius in pixels
    color: string;         // Hex color string
    trail: {x: number; y: number}[];  // Trail positions
};
```
