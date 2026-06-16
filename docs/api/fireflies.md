# Fireflies API

## `Fireflies`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createFireflies(config?: FirefliesConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `FirefliesConfig`

```typescript
interface FirefliesConfig {
    count?: number;
    color?: string;
    size?: number;
    speed?: number;
    glowSpeed?: number;
    scale?: number;
}
```

| Property  | Type     | Default     | Description                                                 |
|-----------|----------|-------------|-------------------------------------------------------------|
| `count`   | `number` | `60`        | Number of fireflies. Automatically halved on small screens. |
| `color`   | `string` | `'#b4ff6a'` | CSS color string for the glow color.                        |
| `size`    | `number` | `6`         | Maximum glow radius in pixels (before scale).               |
| `speed`   | `number` | `1`         | Movement speed multiplier.                                  |
| `glowSpeed`| `number`| `1`         | Glow pulsing speed multiplier.                              |
| `scale`   | `number` | `1`         | Scales all firefly sizes proportionally.                    |
