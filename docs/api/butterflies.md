# Butterflies API

## `Butterflies`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createButterflies(config?: ButterfliesConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `ButterfliesConfig`

```typescript
interface ButterfliesConfig {
    colors?: string[];
    count?: number;
    scale?: number;
    size?: number;
    speed?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `colors` | `string[]` | `['#f4a261', '#e76f51', ...]` | Array of wing colors, one picked randomly per butterfly. |
| `count` | `number` | `12` | Number of butterflies. |
| `scale` | `number` | `1` | Scales all sizes proportionally. |
| `size` | `number` | `20` | Base wing size in pixels. |
| `speed` | `number` | `1` | Speed multiplier for flight and flapping. |
