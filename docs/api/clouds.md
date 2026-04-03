# Clouds API

## `Clouds`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createClouds(config?: CloudsConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `CloudsConfig`

```typescript
interface CloudsConfig {
    color?: string;
    count?: number;
    opacity?: number;
    scale?: number;
    speed?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color` | `string` | `'#ffffff'` | Base color of the cloud sprites. |
| `count` | `number` | `8` | Number of clouds. |
| `opacity` | `number` | `0.8` | Maximum opacity of clouds (0–1). |
| `scale` | `number` | `1` | Scales all sizes proportionally. |
| `speed` | `number` | `0.3` | Drift speed multiplier. |
