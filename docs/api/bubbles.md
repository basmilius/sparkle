# Bubbles API

## `Bubbles`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createBubbles(config?: BubblesConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `BubblesConfig`

```typescript
interface BubblesConfig {
    count?: number;
    sizeRange?: [number, number];
    speed?: number;
    popOnClick?: boolean;
    popRadius?: number;
    colors?: string[];
    wobbleAmount?: number;
    scale?: number;
}
```

| Property      | Type               | Default                             | Description                                               |
|---------------|--------------------|-------------------------------------|-----------------------------------------------------------|
| `count`       | `number`           | `30`                                | Number of bubbles. Automatically halved on small screens. |
| `sizeRange`   | `[number, number]` | `[10, 40]`                          | Min/max bubble radius in pixels (before scale).           |
| `speed`       | `number`           | `1`                                 | Rise speed multiplier.                                    |
| `popOnClick`  | `boolean`          | `true`                              | Enable click-to-pop interaction.                          |
| `popRadius`   | `number`           | `50`                                | Click detection radius in pixels.                         |
| `colors`      | `string[]`         | `['#88ccff', '#aaddff', '#ccbbff']` | Base colors for bubble hue.                               |
| `wobbleAmount`| `number`           | `1`                                 | Horizontal wobble intensity multiplier.                   |
| `scale`       | `number`           | `1`                                 | Scales all bubble sizes proportionally.                   |

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
