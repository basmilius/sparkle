# Sandstorm API

## `Sandstorm`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createSandstorm(config ? : SandstormConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `SandstormConfig`

```typescript
interface SandstormConfig {
    count?: number;
    wind?: number;
    turbulence?: number;
    color?: string;
    hazeOpacity?: number;
    scale?: number;
}
```

| Property     | Type     | Default     | Description                                     |
|--------------|----------|-------------|-------------------------------------------------|
| `count`      | `number` | `300`       | Number of sand grains. Halved on small screens. |
| `wind`       | `number` | `1`         | Horizontal wind strength multiplier.            |
| `turbulence` | `number` | `1`         | Chaotic movement intensity.                     |
| `color`      | `string` | `'#c2956b'` | CSS color string for sand and haze.             |
| `hazeOpacity`| `number` | `0.15`      | Opacity of the atmospheric haze overlay (0-1).  |
| `scale`      | `number` | `1`         | Scales grain sizes proportionally.              |
