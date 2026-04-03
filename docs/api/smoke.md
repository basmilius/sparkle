# Smoke API

## `Smoke`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createSmoke(config?: SmokeConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `SmokeConfig`

```typescript
interface SmokeConfig {
    color?: string;
    count?: number;
    scale?: number;
    speed?: number;
    spread?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color` | `string` | `'#888888'` | Base color of the smoke particles. |
| `count` | `number` | `40` | Number of smoke particles. |
| `scale` | `number` | `1` | Scales all sizes proportionally. |
| `speed` | `number` | `1` | Speed multiplier for rising particles. |
| `spread` | `number` | `0.3` | Horizontal spread of the smoke origin (0–1). |
