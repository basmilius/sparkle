# Stars API

## `Stars`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createStars(config?: StarsConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `StarsConfig`

```typescript
interface StarsConfig {
    mode?: StarMode;
    starCount?: number;
    shootingInterval?: [number, number];
    shootingSpeed?: number;
    twinkleSpeed?: number;
    color?: string;
    shootingColor?: string;
    trailLength?: number;
    scale?: number;
}
```

| Property           | Type               | Default      | Description                                                                  |
|--------------------|--------------------|--------------|------------------------------------------------------------------------------|
| `mode`             | `StarMode`         | `'both'`     | Which layers to display.                                                     |
| `starCount`        | `number`           | `150`        | Number of twinkling background stars. Automatically halved on small screens. |
| `shootingInterval` | `[number, number]` | `[120, 360]` | Tick range between shooting star spawns.                                     |
| `shootingSpeed`    | `number`           | `1`          | Shooting star speed multiplier.                                              |
| `twinkleSpeed`     | `number`           | `1`          | Twinkle animation speed multiplier.                                          |
| `color`            | `string`           | `'#ffffff'`  | Star color (hex string).                                                     |
| `shootingColor`    | `string`           | `'#ffffff'`  | Shooting star color (hex string).                                            |
| `trailLength`      | `number`           | `15`         | Number of trail points per shooting star.                                    |
| `scale`            | `number`           | `1`          | Global scale factor.                                                         |

---

## `StarMode`

```typescript
type StarMode = 'sky' | 'shooting' | 'both';
```

| Mode       | Description                              |
|------------|------------------------------------------|
| `sky`      | Only twinkling background stars.         |
| `shooting` | Only shooting stars with trails.         |
| `both`     | Both twinkling stars and shooting stars. |
