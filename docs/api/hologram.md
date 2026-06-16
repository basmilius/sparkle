# Hologram API

## `Hologram`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createHologram(config?: HologramConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `HologramConfig`

```typescript
interface HologramConfig {
    color?: string;
    dataFragments?: number;
    flickerIntensity?: number;
    scale?: number;
    scanlineSpacing?: number;
    speed?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color` | `string` | `'#00ccff'` | Base color of the holographic projection. |
| `dataFragments` | `number` | `15` | Number of floating data fragments. |
| `flickerIntensity` | `number` | `0.3` | Random brightness flicker strength (0–1). |
| `scale` | `number` | `1` | Scales all sizes proportionally. |
| `scanlineSpacing` | `number` | `3` | Pixel spacing between horizontal scanlines. |
| `speed` | `number` | `1` | Animation speed multiplier. |
