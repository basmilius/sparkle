# Streamers API

## `Streamers`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createStreamers(config?: StreamersConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `StreamersConfig`

```typescript
interface StreamersConfig {
    count?: number;
    colors?: string[];
    speed?: number;
    scale?: number;
}
```

| Property | Type       | Default           | Description                                                      |
|----------|------------|-------------------|------------------------------------------------------------------|
| `count`  | `number`   | `20`              | Number of streamers. Automatically halved on small screens.      |
| `colors` | `string[]` | `STREAMER_COLORS` | Array of hex color strings for the streamers.                    |
| `speed`  | `number`   | `1`               | Fall speed multiplier. Higher values make streamers fall faster. |
| `scale`  | `number`   | `1`               | Scales streamer sizes, widths, and physics proportionally.       |
