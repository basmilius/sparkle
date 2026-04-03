# Popcorn API

## `Popcorn`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createPopcorn(config?: PopcornConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference.

---

## `PopcornConfig`

```typescript
interface PopcornConfig {
    bounciness?: number;
    color?: string;
    count?: number;
    gravity?: number;
    popRate?: number;
    scale?: number;
    speed?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `bounciness` | `number` | `0.6` | Energy retained on each bounce (0–1). |
| `color` | `string` | `'#fff8dc'` | Base color of the popcorn kernels. |
| `count` | `number` | `25` | Maximum number of kernels visible at once. |
| `gravity` | `number` | `1` | Gravity strength pulling kernels down. |
| `popRate` | `number` | `2` | Number of new kernels popping per second. |
| `scale` | `number` | `1` | Scales all sizes proportionally. |
| `speed` | `number` | `1` | Overall speed multiplier. |

---

## `PopcornKernel`

Represents a single popcorn kernel. Used internally by the effect.
