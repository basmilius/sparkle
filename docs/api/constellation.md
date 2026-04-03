# Constellation API

## `Constellation`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createConstellation(config?: ConstellationConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `ConstellationConfig`

```typescript
interface ConstellationConfig {
    color?: string;
    connectionDistance?: number;
    lineWidth?: number;
    scale?: number;
    speed?: number;
    stars?: number;
    twinkleSpeed?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color` | `string` | `'#ffffff'` | Color of the stars and connection lines. |
| `connectionDistance` | `number` | `120` | Maximum pixel distance for connecting two stars. |
| `lineWidth` | `number` | `0.5` | Width of the connection lines in pixels. |
| `scale` | `number` | `1` | Scales all sizes proportionally. |
| `speed` | `number` | `1` | Drift speed multiplier. |
| `stars` | `number` | `50` | Number of stars. |
| `twinkleSpeed` | `number` | `1` | Speed of brightness oscillation. |

---

## `ConstellationStar`

```typescript
interface ConstellationStar {
    brightness: number;
    size: number;
    vx: number;
    vy: number;
    x: number;
    y: number;
}
```

| Property | Type | Description |
|----------|------|-------------|
| `brightness` | `number` | Current brightness level (0–1). |
| `size` | `number` | Radius of the star. |
| `vx` | `number` | Horizontal velocity. |
| `vy` | `number` | Vertical velocity. |
| `x` | `number` | Horizontal position. |
| `y` | `number` | Vertical position. |
