# Firepit API

## `Firepit`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createFirepit(config?: FirepitConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `FirepitConfig`

```typescript
interface FirepitConfig {
    embers?: number;
    flameWidth?: number;
    flameHeight?: number;
    intensity?: number;
    scale?: number;
}
```

| Property     | Type     | Default | Description                                                 |
|--------------|----------|---------|-------------------------------------------------------------|
| `embers`     | `number` | `60`    | Maximum number of ember particles. Halved on small screens. |
| `flameWidth` | `number` | `0.4`   | Flame width as fraction of canvas width.                    |
| `flameHeight`| `number` | `0.35`  | Flame height as fraction of canvas height.                  |
| `intensity`  | `number` | `1`     | Overall brightness and spawn rate multiplier.               |
| `scale`      | `number` | `1`     | Scales ember sizes proportionally.                          |
