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
| `colors` | `string[]` | `['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7']` | Colors used for the gradient blobs. |
| `blobs` | `number` | `5` | Number of gradient blobs. |
| `resolution` | `number` | `6` | Pixel step size for rendering. |
