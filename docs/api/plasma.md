# Plasma API

## `PlasmaSimulation`

Extends [`LimitedFrameRateCanvas`](./general#limitedframeratecanvas).

### Constructor

```typescript
new PlasmaSimulation(canvas: HTMLCanvasElement, config?: PlasmaSimulationConfig)
```

### Methods

#### `start(): void`
Starts the plasma animation.

#### `stop(): void`
Stops the plasma animation.

#### `destroy(): void`
Stops the animation and removes all event listeners.

---

## `PlasmaSimulationConfig`

```typescript
interface PlasmaSimulationConfig {
    speed?: number;
    scale?: number;
    resolution?: number;
    palette?: PlasmaColor[];
    canvasOptions?: CanvasRenderingContext2DSettings;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `speed` | `number` | `1` | Animation speed multiplier. |
| `scale` | `number` | `1` | Pattern scale factor. Higher values create larger patterns. |
| `resolution` | `number` | `4` | Pixel block size for rendering. Higher is faster but chunkier. |
| `palette` | `PlasmaColor[]` | Cyan, magenta, yellow, blue, green | Array of colors to interpolate between. |
| `canvasOptions` | `CanvasRenderingContext2DSettings` | `{colorSpace: 'display-p3'}` | Options passed to `canvas.getContext('2d')`. |

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
