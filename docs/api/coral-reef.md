# Coral Reef API

## `CoralReef`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createCoralReef(config?: CoralReefConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `CoralReefConfig`

```typescript
interface CoralReefConfig {
    anemones?: number;
    bubbles?: number;
    colors?: string[];
    jellyfish?: number;
    scale?: number;
    speed?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `anemones` | `number` | `8` | Number of sea anemones. |
| `bubbles` | `number` | `20` | Number of rising bubbles. |
| `colors` | `string[]` | `['#ff6b9d', '#c44dff', '#00d4aa', '#ff8c42', '#4dc9f6']` | Colors for coral, anemones, and jellyfish. |
| `jellyfish` | `number` | `5` | Number of jellyfish. |
| `scale` | `number` | `1` | Scales all sizes proportionally. |
| `speed` | `number` | `1` | Animation speed multiplier. |
