# Rain API

## `RainSimulation`

Extends [`LimitedFrameRateCanvas`](./general#limitedframeratecanvas).

### Constructor

```typescript
new RainSimulation(canvas: HTMLCanvasElement, config?: RainSimulationConfig)
```

### Methods

#### `start(): void`
Starts the rain animation.

#### `stop(): void`
Stops the rain animation.

#### `destroy(): void`
Stops the animation and removes all event listeners.

---

## `RainSimulationConfig`

```typescript
interface RainSimulationConfig {
    variant?: RainVariant;
    drops?: number;
    wind?: number;
    speed?: number;
    splashes?: boolean;
    lightning?: boolean;
    color?: string;
    groundLevel?: number;
    scale?: number;
    canvasOptions?: CanvasRenderingContext2DSettings;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | `RainVariant` | `'downpour'` | Rain intensity preset. Overrides defaults for `drops`, `speed`, `splashes`, and `lightning`. |
| `drops` | `number` | Varies by variant | Maximum number of raindrops. Automatically halved on small screens. |
| `wind` | `number` | `0` | Horizontal wind strength (-1 to 1). Negative values blow left. |
| `speed` | `number` | Varies by variant | Fall speed multiplier. |
| `splashes` | `boolean` | Varies by variant | Enable splash particles on ground impact. |
| `lightning` | `boolean` | Varies by variant | Enable lightning strikes with screen flash. |
| `color` | `string` | `'rgba(174, 194, 224, 0.6)'` | CSS color string for raindrops and splashes. |
| `groundLevel` | `number` | `1.0` | Normalized Y position of the ground (0-1). |
| `scale` | `number` | `1` | Scales raindrop sizes proportionally. |
| `canvasOptions` | `CanvasRenderingContext2DSettings` | `{colorSpace: 'display-p3'}` | Options passed to `canvas.getContext('2d')`. |

---

## `RainVariant`

```typescript
type RainVariant = 'drizzle' | 'downpour' | 'thunderstorm';
```

| Variant | Drops | Speed | Splashes | Lightning |
|---------|-------|-------|----------|-----------|
| `drizzle` | 80 | 0.6 | No | No |
| `downpour` | 300 | 1.0 | Yes | No |
| `thunderstorm` | 400 | 1.3 | Yes | Yes |

---

## `Raindrop`

Internal representation of a raindrop.

```typescript
type Raindrop = {
    x: number;       // Normalized X position (0-1)
    y: number;       // Normalized Y position (0-1)
    length: number;  // Visual length in pixels
    speed: number;   // Fall speed
    depth: number;   // Parallax depth (0.3-1)
    opacity: number; // Base opacity
};
```
