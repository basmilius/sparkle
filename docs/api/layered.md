# Layered API

Classes for composing multiple simulations on a single canvas.

## `LayeredSimulation`

Manages multiple `SimulationLayer` instances on one canvas with a shared animation loop.

### Constructor

```typescript
new LayeredSimulation(
    canvas: HTMLCanvasElement,
    frameRate?: number,
    options?: CanvasRenderingContext2DSettings
)
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| `canvas` | — | The canvas element to render to. |
| `frameRate` | `60` | Target frame rate. |
| `options` | `{colorSpace: 'display-p3'}` | Canvas context options. |

### Methods

| Method | Description |
|--------|-------------|
| `add(layer)` | Add a layer. Returns `this` for chaining. Attaches event listeners if already running. |
| `start()` | Start the animation loop and mount all layers. |
| `stop()` | Stop the animation loop. |
| `destroy()` | Stop the loop, unmount all layers, and remove event listeners. |

### Example

```typescript
import { AuroraLayer, LayeredSimulation, StarLayer } from '@basmilius/sparkle';

new LayeredSimulation(canvas)
    .add(new AuroraLayer({ shootingStars: false }))
    .add(new StarLayer({ mode: 'shooting' }))
    .start();
```

---

## `SimulationLayer`

Abstract base class for all layer implementations. Extend this to create custom layers.

```typescript
abstract class SimulationLayer {
    abstract tick(dt: number, width: number, height: number): void;
    abstract draw(ctx: CanvasRenderingContext2D, width: number, height: number): void;

    onResize(width: number, height: number): void;
    onMount(canvas: HTMLCanvasElement): void;
    onUnmount(canvas: HTMLCanvasElement): void;
}
```

| Method | Description |
|--------|-------------|
| `tick(dt, width, height)` | Called every frame. `dt` is the normalized frame delta (1.0 = target frame rate). |
| `draw(ctx, width, height)` | Called every frame after `tick`. Render into `ctx`. |
| `onResize(width, height)` | Called when the canvas is resized. Use for pixel-coordinate initialization. |
| `onMount(canvas)` | Called when added to a running simulation or when it starts. Use to attach event listeners. |
| `onUnmount(canvas)` | Called when the simulation is destroyed. Use to remove event listeners. |

### Custom Layer Example

```typescript
import { SimulationLayer } from '@basmilius/sparkle';

class ClockLayer extends SimulationLayer {
    tick(dt: number, width: number, height: number): void {
        // update state
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const now = new Date();
        ctx.fillStyle = 'white';
        ctx.font = '24px monospace';
        ctx.fillText(now.toLocaleTimeString(), 20, 40);
    }
}

new LayeredSimulation(canvas)
    .add(new AuroraLayer())
    .add(new ClockLayer())
    .start();
```

---

## `SimulationCanvas`

A `LimitedFrameRateCanvas` that drives a single `SimulationLayer`. All `XxxSimulation` classes extend this internally.

```typescript
new SimulationCanvas(
    canvas: HTMLCanvasElement,
    simulation: SimulationLayer,
    frameRate?: number,
    options?: CanvasRenderingContext2DSettings
)
```

You generally don't need to use `SimulationCanvas` directly — the `XxxSimulation` convenience classes handle it. Use it when building a simulation class without following the full module pattern:

```typescript
import { SimulationCanvas, SnowLayer } from '@basmilius/sparkle';

class MySnow extends SimulationCanvas {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, new SnowLayer({ scale: 2, particles: 300 }));
    }
}
```

---

## Available Layers

Every simulation has a matching layer class:

| Layer | Simulation |
|-------|-----------|
| `AuroraLayer` | `AuroraSimulation` |
| `BalloonLayer` | `BalloonSimulation` |
| `BubbleLayer` | `BubbleSimulation` |
| `ConfettiLayer` | `ConfettiSimulation` |
| `DonutLayer` | `DonutSimulation` |
| `FireflyLayer` | `FireflySimulation` |
| `FirepitLayer` | `FirepitSimulation` |
| `FireworkLayer` | `FireworkSimulation` |
| `GlitterLayer` | `GlitterSimulation` |
| `LanternLayer` | `LanternSimulation` |
| `LeafLayer` | `LeafSimulation` |
| `LightningLayer` | `LightningSimulation` |
| `MatrixLayer` | `MatrixSimulation` |
| `OrbitLayer` | `OrbitSimulation` |
| `ParticleLayer` | `ParticleSimulation` |
| `PetalLayer` | `PetalSimulation` |
| `PlasmaLayer` | `PlasmaSimulation` |
| `RainLayer` | `RainSimulation` |
| `SandstormLayer` | `SandstormSimulation` |
| `SnowLayer` | `SnowSimulation` |
| `SparklerLayer` | `SparklerSimulation` |
| `StarLayer` | `StarSimulation` |
| `StreamerLayer` | `StreamerSimulation` |
| `WaveLayer` | `WaveSimulation` |
| `WormholeLayer` | `WormholeSimulation` |
