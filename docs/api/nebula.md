# Nebula API

## `Nebula`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createNebula(config?: NebulaConfig): Effect<NebulaConfig>
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `NebulaConfig`

```typescript
interface NebulaConfig {
    readonly starCount?: number;
    readonly speed?: number;
    readonly colors?: string[];
    readonly scale?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `starCount` | `number` | `150` | Number of twinkling stars. |
| `speed` | `number` | `0.3` | Drift speed of the nebula clouds. |
| `colors` | `string[]` | `['#ff6b9d', '#c44dff', '#4d79ff', '#00d4ff']` | Colors used for the nebula blobs. |
| `scale` | `number` | `1` | Uniform scale multiplier. |
