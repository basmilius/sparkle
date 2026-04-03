# Orbits API

## `Orbits`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createOrbits(config?: OrbitsConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `OrbitsConfig`

```typescript
interface OrbitsConfig {
    centers?: number;
    orbitersPerCenter?: number;
    speed?: number;
    colors?: string[];
    trailLength?: number;
    showCenters?: boolean;
    scale?: number;
}
```

| Property            | Type       | Default        | Description                                                            |
|---------------------|------------|----------------|------------------------------------------------------------------------|
| `centers`           | `number`   | `3`            | Number of orbital center points.                                       |
| `orbitersPerCenter` | `number`   | `8`            | Number of particles per center. Automatically halved on small screens. |
| `speed`             | `number`   | `1`            | Orbital speed multiplier.                                              |
| `colors`            | `string[]` | `ORBIT_COLORS` | Array of hex color strings for the orbiters.                           |
| `trailLength`       | `number`   | `15`           | Number of trail segments behind each orbiter.                          |
| `showCenters`       | `boolean`  | `true`         | Whether to draw a subtle glow at each center point.                    |
| `scale`             | `number`   | `1`            | Scales orbit radii and particle sizes proportionally.                  |

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
    trail: { x: number; y: number }[];  // Trail positions
};
```
