# Interference API

## `Interference`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createInterference(config?: InterferenceConfig): Effect<InterferenceConfig>
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `InterferenceConfig`

```typescript
interface InterferenceConfig {
    readonly speed?: number;
    readonly scale?: number;
    readonly resolution?: number;
    readonly layers?: number;
    readonly colors?: string[];
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `speed` | `number` | `1` | Animation speed multiplier. |
| `scale` | `number` | `1` | Scales all sizes proportionally. |
| `resolution` | `number` | `3` | Pixel step size for rendering. |
| `layers` | `number` | `3` | Number of concentric wave sources. |
| `colors` | `string[]` | — | Colors for each wave source layer. |
