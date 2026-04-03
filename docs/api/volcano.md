# Volcano API

## `Volcano`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createVolcano(config?: VolcanoConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `VolcanoConfig`

```typescript
interface VolcanoConfig {
    color?: string;
    embers?: number;
    intensity?: number;
    projectiles?: number;
    scale?: number;
    smokeColor?: string;
    speed?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color` | `string` | `'#ff4400'` | Base color of lava projectiles and embers. |
| `embers` | `number` | `60` | Number of glowing ember particles. |
| `intensity` | `number` | `1` | Eruption force multiplier. |
| `projectiles` | `number` | `30` | Number of lava projectiles. |
| `scale` | `number` | `1` | Scales all sizes proportionally. |
| `smokeColor` | `string` | `'#444444'` | Color of the rising smoke plume. |
| `speed` | `number` | `1` | Animation speed multiplier. |

---

## `VolcanoProjectile`

```typescript
interface VolcanoProjectile {
    angle: number;
    glow: number;
    size: number;
    speed: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
}
```
