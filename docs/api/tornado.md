# Tornado API

## `Tornado`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createTornado(config?: TornadoConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `TornadoConfig`

```typescript
interface TornadoConfig {
    color?: string;
    debris?: number;
    intensity?: number;
    scale?: number;
    speed?: number;
    width?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color` | `string` | `'#8b7355'` | Base color of the funnel and debris particles. |
| `debris` | `number` | `40` | Number of debris particles spiraling around the vortex. Halved on small screens. |
| `intensity` | `number` | `1` | Vortex strength multiplier. |
| `scale` | `number` | `1` | Scales all sizes proportionally. |
| `speed` | `number` | `1` | Animation speed multiplier. |
| `width` | `number` | `0.3` | Relative width of the funnel base (0–1). |
