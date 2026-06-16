# Glitter API

## `Glitter`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createGlitter(config?: GlitterConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `GlitterConfig`

```typescript
interface GlitterConfig {
    count?: number;
    colors?: string[];
    size?: number;
    speed?: number;
    groundLevel?: number;
    maxSettled?: number;
    scale?: number;
}
```

| Property     | Type       | Default                                                                         | Description                                                                              |
|--------------|------------|---------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|
| `count`      | `number`   | `80`                                                                            | Number of falling glitter pieces. Automatically halved on small screens.                 |
| `colors`     | `string[]` | `['#ffd700', '#c0c0c0', '#ff69b4', '#00bfff', '#ff4500', '#7fff00', '#9370db']` | Hex color strings for the glitter pieces.                                                |
| `size`       | `number`   | `4`                                                                             | Base glitter piece size in pixels (before scale).                                        |
| `speed`      | `number`   | `1`                                                                             | Fall speed multiplier.                                                                   |
| `groundLevel`| `number`   | `0.85`                                                                          | Normalized Y position (0-1) where glitter settles.                                       |
| `maxSettled` | `number`   | `200`                                                                           | Maximum number of settled pieces on the ground. Oldest pieces are removed when exceeded. |
| `scale`      | `number`   | `1`                                                                             | Scales all piece sizes proportionally.                                                   |
