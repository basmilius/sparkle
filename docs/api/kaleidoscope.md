# Kaleidoscope API

## `Kaleidoscope`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createKaleidoscope(config?: KaleidoscopeConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `KaleidoscopeConfig`

```typescript
interface KaleidoscopeConfig {
    colors?: string[];
    scale?: number;
    segments?: number;
    shapes?: number;
    speed?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `colors` | `string[]` | `['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7dc6f', '#bb8fce']` | Colors used for the shapes. |
| `scale` | `number` | `1` | Scales all sizes proportionally. |
| `segments` | `number` | `8` | Number of symmetry segments. |
| `shapes` | `number` | `15` | Number of shapes rendered per segment. |
| `speed` | `number` | `1` | Rotation and morphing speed. |

---

## `KaleidoscopeShape`

Represents a single shape within the kaleidoscope pattern. Used internally by the effect.
