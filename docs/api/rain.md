# Rain API

## `Rain`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createRain(config?: RainConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `RainConfig`

```typescript
interface RainConfig {
    variant?: RainVariant;
    drops?: number;
    wind?: number;
    speed?: number;
    splashes?: boolean;
    color?: string;
    groundLevel?: number;
    scale?: number;
}
```

| Property     | Type          | Default                      | Description                                                                             |
|--------------|---------------|------------------------------|-----------------------------------------------------------------------------------------|
| `variant`    | `RainVariant` | `'downpour'`                 | Rain intensity preset. Overrides defaults for `drops`, `speed`, `wind`, and `splashes`. |
| `drops`      | `number`      | Varies by variant            | Maximum number of raindrops. Automatically halved on small screens.                     |
| `wind`       | `number`      | Varies by variant            | Horizontal wind strength. Negative values blow left.                                    |
| `speed`      | `number`      | Varies by variant            | Fall speed multiplier.                                                                  |
| `splashes`   | `boolean`     | Varies by variant            | Enable splash particles on ground impact.                                               |
| `color`      | `string`      | `'rgba(174, 194, 224, 0.6)'` | CSS color string for raindrops and splashes.                                            |
| `groundLevel`| `number`      | `1.0`                        | Normalized Y position of the ground (0-1).                                              |
| `scale`      | `number`      | `1`                          | Scales raindrop sizes proportionally.                                                   |

---

## `RainVariant`

```typescript
type RainVariant = 'drizzle' | 'downpour' | 'thunderstorm';
```

| Variant        | Drops | Speed | Wind | Splashes |
|----------------|-------|-------|------|----------|
| `drizzle`      | 70    | 0.55  | 0.1  | No       |
| `downpour`     | 200   | 0.85  | 0.25 | Yes      |
| `thunderstorm` | 300   | 1.0   | 0.4  | Yes      |

---

## `Raindrop`

Internal representation of a raindrop.

```typescript
type Raindrop = {
    x: number;       // Normalized X position (0-1)
    y: number;       // Normalized Y position (0-1)
    vx: number;      // Horizontal velocity (pixels/tick)
    vy: number;      // Vertical velocity (pixels/tick)
    length: number;  // Visual length in pixels
    speed: number;   // Fall speed
    depth: number;   // Parallax depth (0.3-1)
    opacity: number; // Base opacity
};
```
