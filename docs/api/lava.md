# Lava API

## `Lava`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createLava(config?: LavaConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `LavaConfig`

```typescript
interface LavaConfig {
    count?: number;
    speed?: number;
    colors?: string[];
    scale?: number;
}
```

| Property | Type       | Default                                              | Description                                                        |
|----------|------------|------------------------------------------------------|--------------------------------------------------------------------|
| `count`  | `number`   | `12`                                                 | Number of lava blobs. Automatically reduced on small screens.      |
| `speed`  | `number`   | `1`                                                  | Movement speed multiplier for blob floating motion.                |
| `colors` | `string[]` | `['#ff4400', '#ff8800', '#ffcc00', '#ff0066']`       | Array of CSS color strings for the lava blobs.                     |
| `scale`  | `number`   | `1`                                                  | Scales all blob radii proportionally.                              |
