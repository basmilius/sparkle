# Lightning API

## `LightningSimulation`

Extends [`LimitedFrameRateCanvas`](./general#limitedframeratecanvas).

### Constructor

```typescript
new LightningSimulation(canvas: HTMLCanvasElement, config?: LightningSimulationConfig)
```

### Methods

#### `start(): void`
Starts the lightning animation.

#### `stop(): void`
Stops the lightning animation.

#### `destroy(): void`
Stops the animation and removes all event listeners.

---

## `LightningSimulationConfig`

```typescript
interface LightningSimulationConfig {
    frequency?: number;
    color?: string;
    branches?: boolean;
    flash?: boolean;
    scale?: number;
    canvasOptions?: CanvasRenderingContext2DSettings;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `frequency` | `number` | `1` | Bolt spawn rate multiplier. `1` means roughly one bolt every 3 seconds. |
| `color` | `string` | `'#b4c8ff'` | Hex color string for the bolt glow. The inner line is always white. |
| `branches` | `boolean` | `true` | Enable smaller branch bolts forking off the main bolt. |
| `flash` | `boolean` | `true` | Enable a brief white screen flash when a bolt strikes. |
| `scale` | `number` | `1` | Global scale factor for line widths. |
| `canvasOptions` | `CanvasRenderingContext2DSettings` | `{colorSpace: 'display-p3'}` | Options passed to `canvas.getContext('2d')`. |

---

## `LightningBolt`

Internal representation of a lightning bolt.

```typescript
type LightningBolt = {
    segments: {x: number; y: number}[];  // Normalized positions (0-1)
    branches: LightningBranch[];         // Forked sub-bolts
    alpha: number;                       // Current opacity (1 to 0)
    lifetime: number;                    // Total lifetime in ticks
    ticksAlive: number;                  // Ticks since spawn
};
```

---

## `LightningBranch`

Internal representation of a branch forking off a main bolt.

```typescript
type LightningBranch = {
    segments: {x: number; y: number}[];  // Normalized positions (0-1)
    alpha: number;                       // Branch opacity relative to parent
};
```
