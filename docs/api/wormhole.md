# Wormhole API

## `WormholeSimulation`

Extends [`LimitedFrameRateCanvas`](./general#limitedframeratecanvas).

### Constructor

```typescript
new WormholeSimulation(canvas: HTMLCanvasElement, config?: WormholeSimulationConfig)
```

### Methods

#### `start(): void`
Initializes particles and starts the animation loop.

#### `stop(): void`
Stops the animation loop.

#### `destroy(): void`
Stops the animation and removes all event listeners.

---

## `WormholeSimulationConfig`

```typescript
interface WormholeSimulationConfig {
    count?: number;
    speed?: number;
    color?: string;
    direction?: WormholeDirection;
    scale?: number;
    canvasOptions?: CanvasRenderingContext2DSettings;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `count` | `number` | `200` | Number of particles. Automatically halved on small screens. |
| `speed` | `number` | `1` | Global speed multiplier for particle movement. |
| `color` | `string` | `'#6699ff'` | Particle and glow color (hex string). |
| `direction` | `WormholeDirection` | `'inward'` | Direction of particle flow. |
| `scale` | `number` | `1` | Global scale factor for particle sizes and trails. |
| `canvasOptions` | `CanvasRenderingContext2DSettings` | `{colorSpace: 'display-p3'}` | Options passed to `canvas.getContext('2d')`. |

---

## `WormholeDirection`

```typescript
type WormholeDirection = 'inward' | 'outward';
```

| Direction | Description |
|-----------|-------------|
| `inward` | Particles flow from the edges toward the center, accelerating as they approach. |
| `outward` | Particles flow from the center outward, accelerating as they move away. |

---

## `WormholeParticle`

Internal representation of a wormhole particle in polar coordinates.

```typescript
type WormholeParticle = {
    angle: number;      // Angular position in radians
    distance: number;   // Distance from center in pixels
    speed: number;      // Base radial speed
    size: number;       // Particle size
    brightness: number; // Base brightness (0-1)
    trail: number;      // Trail length in pixels
};
```
