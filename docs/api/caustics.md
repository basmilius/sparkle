# Caustics API

## `Caustics`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createCaustics(config?: CausticsConfig): Effect<CausticsConfig>
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `CausticsConfig`

```typescript
interface CausticsConfig {
    readonly speed?: number;
    readonly scale?: number;
    readonly resolution?: number;
    readonly intensity?: number;
    readonly color?: string;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `speed` | `number` | `1` | Animation speed multiplier. |
| `scale` | `number` | `1` | Scales all sizes proportionally. |
| `resolution` | `number` | `4` | Pixel step size for rendering. |
| `intensity` | `number` | `0.7` | Brightness of the caustic lines (0–1). |
| `color` | `string` | `'#4488cc'` | Base tint color for the caustic pattern. |
