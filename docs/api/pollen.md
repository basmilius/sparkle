# Pollen API

## `Pollen`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createPollen(config?: PollenConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `PollenConfig`

```typescript
interface PollenConfig {
    color?: string;
    count?: number;
    glowSize?: number;
    scale?: number;
    size?: number;
    speed?: number;
    wind?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color` | `string` | `'#fff8e1'` | Color of the pollen particles. |
| `count` | `number` | `40` | Number of pollen particles. |
| `glowSize` | `number` | `2` | Glow size multiplier relative to particle size. |
| `scale` | `number` | `1` | Scales all sizes proportionally. |
| `size` | `number` | `3` | Base radius of each particle in pixels. |
| `speed` | `number` | `0.5` | Drift speed multiplier. |
| `wind` | `number` | `0.3` | Horizontal wind strength. |

---

## `PollenParticle`

```typescript
interface PollenParticle {
    glowPhase: number;
    opacity: number;
    size: number;
    vx: number;
    vy: number;
    x: number;
    y: number;
}
```
