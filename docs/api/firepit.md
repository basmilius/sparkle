# Firepit API

## `Firepit`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createFirepit(config?: FirepitConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `FirepitConfig`

```typescript
interface FirepitConfig {
    embers?: number;
    flameWidth?: number;
    flameHeight?: number;
    intensity?: number;
    scale?: number;
}
```

| Property     | Type     | Default | Description                                                 |
|--------------|----------|---------|-------------------------------------------------------------|
| `embers`     | `number` | `60`    | Maximum number of ember particles. Halved on small screens. |
| `flameWidth` | `number` | `0.4`   | Flame width as fraction of canvas width.                    |
| `flameHeight`| `number` | `0.35`  | Flame height as fraction of canvas height.                  |
| `intensity`  | `number` | `1`     | Overall brightness and spawn rate multiplier.               |
| `scale`      | `number` | `1`     | Scales ember sizes proportionally.                          |

---

## `Ember`

Internal representation of a rising ember particle.

```typescript
type Ember = {
    x: number;        // Normalized X position (0-1)
    y: number;        // Normalized Y position (0-1)
    vx: number;       // Horizontal velocity
    vy: number;       // Vertical velocity (negative = upward)
    size: number;     // Ember size in pixels
    life: number;     // Remaining life in ticks
    maxLife: number;  // Maximum life for fade calculation
    brightness: number; // Color variation (0-1)
    flicker: number;  // Current flicker intensity
};
```
