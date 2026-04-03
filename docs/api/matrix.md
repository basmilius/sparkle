# Matrix API

## `MatrixSimulation`

Extends [`LimitedFrameRateCanvas`](./general#limitedframeratecanvas).

### Constructor

```typescript
new MatrixSimulation(canvas: HTMLCanvasElement, config?: MatrixSimulationConfig)
```

### Methods

#### `start(): void`

Starts the matrix rain animation. Creates columns based on the current canvas dimensions.

#### `stop(): void`

Stops the matrix rain animation.

#### `destroy(): void`

Stops the animation and removes all event listeners.

---

## `MatrixSimulationConfig`

```typescript
interface MatrixSimulationConfig {
    columns?: number;
    speed?: number;
    color?: string;
    fontSize?: number;
    trailLength?: number;
    scale?: number;
    canvasOptions?: CanvasRenderingContext2DSettings;
}
```

| Property        | Type                               | Default                      | Description                                                                       |
|-----------------|------------------------------------|------------------------------|-----------------------------------------------------------------------------------|
| `columns`       | `number`                           | `40`                         | Maximum number of active falling columns. Automatically halved on small screens.  |
| `speed`         | `number`                           | `1`                          | Fall speed multiplier. Higher values make characters fall faster.                 |
| `color`         | `string`                           | `'#00ff41'`                  | Hex color string for the trailing characters. The head character is always white. |
| `fontSize`      | `number`                           | `14`                         | Character size in pixels. Also determines column spacing. Scaled by `scale`.      |
| `trailLength`   | `number`                           | `20`                         | Base number of characters per column trail. Actual length varies randomly.        |
| `scale`         | `number`                           | `1`                          | Scales font size proportionally.                                                  |
| `canvasOptions` | `CanvasRenderingContext2DSettings` | `{colorSpace: 'display-p3'}` | Options passed to `canvas.getContext('2d')`.                                      |

---

## `MatrixColumn`

Internal representation of a falling column.

```typescript
type MatrixColumn = {
    x: number;              // X position in pixels (center of column)
    y: number;              // Y position of the head character in pixels
    speed: number;          // Fall speed of this column
    chars: string[];        // Array of characters in the trail
    length: number;         // Number of characters in the trail
    headBrightness: number; // Brightness of the head character (0.8-1.0)
};
```
