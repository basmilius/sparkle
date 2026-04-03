# Waves API

## `Waves`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createWaves(config?: WavesConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `WavesConfig`

```typescript
interface WavesConfig {
    layers?: number;
    speed?: number;
    colors?: string[];
    foamColor?: string;
    foamAmount?: number;
    scale?: number;
}
```

| Property    | Type       | Default                                                   | Description                                                                        |
|-------------|------------|-----------------------------------------------------------|------------------------------------------------------------------------------------|
| `layers`    | `number`   | `5`                                                       | Number of wave layers drawn from back to front.                                    |
| `speed`     | `number`   | `1`                                                       | Animation speed multiplier for wave movement.                                      |
| `colors`    | `string[]` | `['#0a3d6b', '#0e5a8a', '#1a7ab5', '#3399cc', '#66c2e0']` | Colors for each wave layer, from back to front. Colors cycle if fewer than layers. |
| `foamColor` | `string`   | `'#ffffff'`                                               | CSS color for foam speckles near wave crests.                                      |
| `foamAmount`| `number`   | `0.4`                                                     | Foam intensity (0-1). Set to 0 to disable foam.                                    |
| `scale`     | `number`   | `1`                                                       | Global scale factor for wave amplitude and foam size.                              |

---

## `Wave`

Internal representation of a single wave layer.

```typescript
type Wave = {
    amplitude: number;    // Wave height in pixels
    frequency: number;    // Horizontal wave frequency
    speed: number;        // Individual wave speed
    phase: number;        // Current phase offset
    baseY: number;        // Normalized vertical position (0-1)
    color: string;        // Fill color for this wave layer
    foamThreshold: number; // Threshold for foam spawn near crests
};
```
