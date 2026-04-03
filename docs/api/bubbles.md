# Bubbles API

## `BubbleSimulation`

Extends [`LimitedFrameRateCanvas`](./general#limitedframeratecanvas).

### Constructor

```typescript
new BubbleSimulation(canvas: HTMLCanvasElement, config?: BubbleSimulationConfig)
```

### Methods

#### `start(): void`

Starts the bubble animation.

#### `stop(): void`

Stops the bubble animation.

#### `destroy(): void`

Stops the animation, removes click listener, and removes all event listeners.

---

## `BubbleSimulationConfig`

```typescript
interface BubbleSimulationConfig {
    count?: number;
    sizeRange?: [number, number];
    speed?: number;
    popOnClick?: boolean;
    popRadius?: number;
    colors?: string[];
    wobbleAmount?: number;
    scale?: number;
    canvasOptions?: CanvasRenderingContext2DSettings;
}
```

| Property        | Type                               | Default                             | Description                                               |
|-----------------|------------------------------------|-------------------------------------|-----------------------------------------------------------|
| `count`         | `number`                           | `30`                                | Number of bubbles. Automatically halved on small screens. |
| `sizeRange`     | `[number, number]`                 | `[10, 40]`                          | Min/max bubble radius in pixels (before scale).           |
| `speed`         | `number`                           | `1`                                 | Rise speed multiplier.                                    |
| `popOnClick`    | `boolean`                          | `true`                              | Enable click-to-pop interaction.                          |
| `popRadius`     | `number`                           | `50`                                | Click detection radius in pixels.                         |
| `colors`        | `string[]`                         | `['#88ccff', '#aaddff', '#ccbbff']` | Base colors for bubble hue.                               |
| `wobbleAmount`  | `number`                           | `1`                                 | Horizontal wobble intensity multiplier.                   |
| `scale`         | `number`                           | `1`                                 | Scales all bubble sizes proportionally.                   |
| `canvasOptions` | `CanvasRenderingContext2DSettings` | `{colorSpace: 'display-p3'}`        | Options passed to `canvas.getContext('2d')`.              |

---

## `Bubble`

Internal representation of a bubble.

```typescript
type Bubble = {
    x: number;          // Normalized X position (0-1)
    y: number;          // Normalized Y position (0-1)
    radius: number;     // Bubble radius in pixels
    speed: number;      // Rise speed
    hue: number;        // HSL hue value
    wobblePhase: number; // Wobble oscillation phase
    wobbleFreq: number;  // Wobble frequency
    wobbleAmp: number;   // Wobble amplitude
    opacity: number;     // Base opacity
};
```
