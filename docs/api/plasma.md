# Plasma API

## `Plasma`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createPlasma(config?: PlasmaConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `PlasmaConfig`

```typescript
interface PlasmaConfig {
    speed?: number;
    scale?: number;
    resolution?: number;
    palette?: PlasmaColor[];
}
```

| Property     | Type            | Default                            | Description                                                    |
|--------------|-----------------|------------------------------------|----------------------------------------------------------------|
| `speed`      | `number`        | `1`                                | Animation speed multiplier.                                    |
| `scale`      | `number`        | `1`                                | Pattern scale factor. Higher values create larger patterns.    |
| `resolution` | `number`        | `4`                                | Pixel block size for rendering. Higher is faster but chunkier. |
| `palette`    | `PlasmaColor[]` | Cyan, magenta, yellow, blue, green | Array of colors to interpolate between.                        |

---

## `PlasmaColor`

Color definition used in the palette.

```typescript
type PlasmaColor = {
    r: number;  // Red channel (0-255)
    g: number;  // Green channel (0-255)
    b: number;  // Blue channel (0-255)
};
```
