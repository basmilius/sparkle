# Leaves API

## `Leaves`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createLeaves(config?: LeavesConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `LeavesConfig`

```typescript
interface LeavesConfig {
    count?: number;
    colors?: string[];
    size?: number;
    speed?: number;
    wind?: number;
    scale?: number;
}
```

| Property | Type       | Default                    | Description                                                  |
|----------|------------|----------------------------|--------------------------------------------------------------|
| `count`  | `number`   | `80`                       | Number of leaves. Automatically halved on small screens.     |
| `colors` | `string[]` | Autumn palette (10 colors) | Array of CSS color strings for leaf colors.                  |
| `size`   | `number`   | `30`                       | Maximum leaf size in pixels (before scale).                  |
| `speed`  | `number`   | `1`                        | Fall speed multiplier.                                       |
| `wind`   | `number`   | `0.15`                     | Horizontal wind strength. Positive = right, negative = left. |
| `scale`  | `number`   | `1`                        | Scales all leaf sizes proportionally.                        |
