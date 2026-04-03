# Streamers API

## `Streamers`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createStreamers(config?: StreamersConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `StreamersConfig`

```typescript
interface StreamersConfig {
    count?: number;
    colors?: string[];
    speed?: number;
    scale?: number;
}
```

| Property | Type       | Default           | Description                                                      |
|----------|------------|-------------------|------------------------------------------------------------------|
| `count`  | `number`   | `20`              | Number of streamers. Automatically halved on small screens.      |
| `colors` | `string[]` | `STREAMER_COLORS` | Array of hex color strings for the streamers.                    |
| `speed`  | `number`   | `1`               | Fall speed multiplier. Higher values make streamers fall faster. |
| `scale`  | `number`   | `1`               | Scales streamer sizes, widths, and physics proportionally.       |

---

## `Streamer`

Internal representation of a single streamer ribbon.

```typescript
type Streamer = {
    x: number;            // Head X position in pixels
    y: number;            // Head Y position in pixels
    length: number;       // Total ribbon length in pixels
    width: number;        // Base ribbon width in pixels
    segments: { x: number; y: number }[]; // Points forming the ribbon path
    fallSpeed: number;    // Vertical fall speed per frame
    swayPhase: number;    // Current phase of the sway oscillation
    swaySpeed: number;    // Speed of the sway oscillation
    swayAmplitude: number; // Horizontal sway distance
    color: string;        // Hex color string
    curl: number;         // Curl intensity affecting wave shape
    depth: number;        // Parallax depth (0.4-1), affects size and opacity
};
```
