# Magnetic Sand API

## `MagneticSand`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createMagneticSand(config?: MagneticSandConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

The magnetic sand effect responds to mouse hover: particles within range align into eight radial spike formations around the cursor.

---

## `MagneticSandConfig`

```typescript
interface MagneticSandConfig {
    speed?: number;
    count?: number;
    color?: string;
    magnetStrength?: number;
    scale?: number;
}
```

| Property         | Type     | Default      | Description                                                          |
|------------------|----------|--------------|----------------------------------------------------------------------|
| `speed`          | `number` | `1`          | Animation speed multiplier.                                          |
| `count`          | `number` | `600`        | Number of sand grains. Halved on small screens.                      |
| `color`          | `string` | `'#1a1a1a'`  | Color of all sand grains.                                            |
| `magnetStrength` | `number` | `1`          | Strength of the magnetic attraction and spike formation.             |
| `scale`          | `number` | `1`          | Global scale factor for grain sizes and interaction radius.          |
