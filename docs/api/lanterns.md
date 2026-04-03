# Lanterns API

## `Lanterns`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createLanterns(config?: LanternsConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `LanternsConfig`

```typescript
interface LanternsConfig {
    count?: number;
    colors?: string[];
    size?: number;
    speed?: number;
    scale?: number;
}
```

| Property | Type       | Default          | Description                                                |
|----------|------------|------------------|------------------------------------------------------------|
| `count`  | `number`   | `25`             | Number of lanterns. Automatically halved on small screens. |
| `colors` | `string[]` | `LANTERN_COLORS` | Array of hex color strings for the lantern colors.         |
| `size`   | `number`   | `20`             | Base lantern size in pixels (before scale).                |
| `speed`  | `number`   | `0.5`            | Rise speed multiplier.                                     |
| `scale`  | `number`   | `1`              | Scales all lantern sizes proportionally.                   |

---

## `Lantern`

Internal representation of a lantern particle.

```typescript
type Lantern = {
    x: number;            // Normalized X position (0-1)
    y: number;            // Normalized Y position (0-1)
    vx: number;           // Horizontal velocity (unused, reserved)
    vy: number;           // Rise speed factor
    size: number;         // Lantern size in pixels
    glowPhase: number;    // Glow pulse phase offset
    glowSpeed: number;    // Individual glow pulse speed
    swayPhase: number;    // Sway oscillation phase offset
    swaySpeed: number;    // Sway oscillation speed
    swayAmplitude: number; // Sway oscillation amplitude
    colorIndex: number;   // Index into the colors array
    opacity: number;      // Base opacity (0-1)
};
```
