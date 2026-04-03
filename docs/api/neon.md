# Neon API

## `Neon`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createNeon(config?: NeonConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `NeonConfig`

```typescript
interface NeonConfig {
    count?: number;
    speed?: number;
    colors?: string[];
    flicker?: boolean;
    scale?: number;
}
```

| Property  | Type       | Default                                                  | Description                                              |
|-----------|------------|----------------------------------------------------------|----------------------------------------------------------|
| `count`   | `number`   | `8`                                                      | Number of neon tubes rendered.                           |
| `speed`   | `number`   | `1`                                                      | Animation speed multiplier.                              |
| `colors`  | `string[]` | `['#ff0080', '#00ffff', '#ffff00', '#ff6600', '#aa00ff']`| Array of CSS color strings for the neon tubes.           |
| `flicker` | `boolean`  | `true`                                                   | Whether tubes randomly flicker on and off.               |
| `scale`   | `number`   | `1`                                                      | Scales tube sizes proportionally.                        |
