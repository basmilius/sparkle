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
| `colors` | `string[]` | `['#ff3366', '#33ccff', '#ffcc00', '#66ff66', '#cc66ff', '#ff9933']` | Colors used for the shapes. |
| `scale` | `number` | `1` | Scales all sizes proportionally. |
| `segments` | `number` | `8` | Number of symmetry segments. |
| `shapes` | `number` | `15` | Number of shapes rendered per segment. |
| `speed` | `number` | `1` | Rotation and morphing speed. |
