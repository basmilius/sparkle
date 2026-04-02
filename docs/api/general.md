# General API

Shared types and base classes used across all simulations.

## `LimitedFrameRateCanvas`

Base class for all simulations. Manages the animation loop, frame rate limiting, resize handling, and visibility state.

### Constructor

```typescript
new LimitedFrameRateCanvas(
    canvas: HTMLCanvasElement,
    frameRate: number,
    options?: CanvasRenderingContext2DSettings
)
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `canvas` | `HTMLCanvasElement` | The canvas element. |
| `context` | `CanvasRenderingContext2D` | The 2D rendering context. |
| `delta` | `number` | Milliseconds since last frame. |
| `deltaFactor` | `number` | Frame rate adjustment factor for consistent speed across frame rates. |
| `frameRate` | `number` | Target frame rate. |
| `isSmall` | `boolean` | `true` when viewport is narrower than 991px. |
| `isTicking` | `boolean` | `true` when the animation loop is running. |
| `ticks` | `number` | Total frame count since start. |
| `height` | `number` | Canvas display height in pixels. |
| `width` | `number` | Canvas display width in pixels. |

### Methods

| Method | Description |
|--------|-------------|
| `start()` | Start the animation loop. Calls `onResize()` and begins `requestAnimationFrame`. |
| `stop()` | Stop the animation loop. Cancels the pending animation frame. |
| `destroy()` | Stop the loop and remove all event listeners (`resize`, `visibilitychange`). |

### Behavior

- **Frame rate limiting** — The loop runs at the native refresh rate but only calls `tick()` and `draw()` when enough time has passed for the target frame rate.
- **Visibility handling** — Automatically pauses when the browser tab is hidden and resumes when visible again. The delta timer is reset to avoid large jumps.
- **Resize handling** — Listens to `window.resize` and updates the internal `width` and `height` from the canvas bounding rect.

---

## `Point`

A 2D coordinate used for positions and targets.

```typescript
type Point = {
    x: number;
    y: number;
};
```
