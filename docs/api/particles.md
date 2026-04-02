# Particles API

## `ParticleSimulation`

Extends [`LimitedFrameRateCanvas`](./general#limitedframeratecanvas).

### Constructor

```typescript
new ParticleSimulation(canvas: HTMLCanvasElement, config?: ParticleSimulationConfig)
```

### Methods

#### `start(): void`
Starts the particle animation.

#### `stop(): void`
Stops the particle animation.

#### `destroy(): void`
Stops the animation, removes mouse listeners, and removes all event listeners.

---

## `ParticleSimulationConfig`

```typescript
interface ParticleSimulationConfig {
    count?: number;
    color?: string;
    lineColor?: string;
    size?: [number, number];
    speed?: [number, number];
    connectionDistance?: number;
    lineWidth?: number;
    mouseMode?: ParticleMouseMode;
    mouseRadius?: number;
    mouseStrength?: number;
    particleForces?: boolean;
    glow?: boolean;
    background?: string | null;
    scale?: number;
    canvasOptions?: CanvasRenderingContext2DSettings;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `count` | `number` | `100` | Number of particles. Automatically halved on small screens. |
| `color` | `string` | `'#6366f1'` | Particle fill color (hex string). |
| `lineColor` | `string` | `'#6366f1'` | Connection line color (hex string). |
| `size` | `[number, number]` | `[1, 3]` | Min/max particle radius in pixels. |
| `speed` | `[number, number]` | `[0.2, 0.8]` | Min/max particle drift speed. |
| `connectionDistance` | `number` | `120` | Maximum distance for connection lines (before scale). |
| `lineWidth` | `number` | `0.5` | Connection line width in pixels. |
| `mouseMode` | `ParticleMouseMode` | `'connect'` | Mouse interaction mode. |
| `mouseRadius` | `number` | `150` | Mouse influence radius in pixels (before scale). |
| `mouseStrength` | `number` | `0.03` | Mouse force strength (attract/repel modes). |
| `particleForces` | `boolean` | `false` | Enable inter-particle repulsion. |
| `glow` | `boolean` | `false` | Enable particle glow effect via shadowBlur. |
| `background` | `string \| null` | `null` | Background fill color. `null` for transparent. |
| `scale` | `number` | `1` | Global scale factor. |
| `canvasOptions` | `CanvasRenderingContext2DSettings` | `{colorSpace: 'display-p3'}` | Options passed to `canvas.getContext('2d')`. |

---

## `ParticleMouseMode`

```typescript
type ParticleMouseMode = 'attract' | 'repel' | 'connect' | 'none';
```

| Mode | Description |
|------|-------------|
| `attract` | Particles within `mouseRadius` are pulled toward the cursor. |
| `repel` | Particles within `mouseRadius` are pushed away from the cursor. |
| `connect` | Connection lines are drawn between the cursor and nearby particles. |
| `none` | No mouse interaction. |

---

## `NetworkParticle`

Internal representation of a particle.

```typescript
type NetworkParticle = {
    x: number;        // X position in pixels
    y: number;        // Y position in pixels
    vx: number;       // Horizontal velocity
    vy: number;       // Vertical velocity
    radius: number;   // Particle radius
    baseSpeed: number; // Base drift speed
};
```

## Performance

The simulation uses spatial grid partitioning to efficiently find nearby particles. Each frame, particles are bucketed into grid cells of size `connectionDistance`. Only neighboring cells are checked for connections, reducing the complexity from O(n^2) to approximately O(n*k), where k is the average number of neighbors per cell.

For best performance, keep `count` under 200 particles.
