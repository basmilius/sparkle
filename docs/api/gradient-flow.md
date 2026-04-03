# Gradient Flow API

## `GradientFlow`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createGradientFlow(config?: GradientFlowConfig): Effect<GradientFlowConfig>
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `GradientFlowConfig`

```typescript
interface GradientFlowConfig {
    readonly speed?: number;
    readonly scale?: number;
    readonly colors?: string[];
    readonly blobs?: number;
    readonly resolution?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `speed` | `number` | `0.5` | Drift speed of the color blobs. |
| `scale` | `number` | `1` | Scales all sizes proportionally. |
| `colors` | `string[]` | — | Colors used for the gradient blobs. |
| `blobs` | `number` | `5` | Number of gradient blobs. |
| `resolution` | `number` | `6` | Pixel step size for rendering. |

---

## `GradientBlob`

```typescript
interface GradientBlob {
    readonly x: number;
    readonly y: number;
    readonly vx: number;
    readonly vy: number;
    readonly radius: number;
    readonly color: string;
}
```

| Property | Type | Description |
|----------|------|-------------|
| `x` | `number` | X coordinate of the blob center. |
| `y` | `number` | Y coordinate of the blob center. |
| `vx` | `number` | Horizontal velocity. |
| `vy` | `number` | Vertical velocity. |
| `radius` | `number` | Influence radius of the blob. |
| `color` | `string` | Color of the blob. |
