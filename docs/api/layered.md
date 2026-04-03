# Layered API

Classes for composing multiple effects on a single canvas.

## `Scene`

Manages multiple `Effect` instances on one canvas with a shared animation loop.

### Factory Function

```typescript
createScene(
    canvas ? : HTMLCanvasElement,
    frameRate ? : number,
    options ? : CanvasRenderingContext2DSettings
)
```

| Parameter   | Default                      | Description                                             |
|-------------|------------------------------|---------------------------------------------------------|
| `canvas`    | —                            | Optional canvas element. Can also be set via `mount()`. |
| `frameRate` | `60`                         | Target frame rate.                                      |
| `options`   | `{colorSpace: 'display-p3'}` | Canvas context options.                                 |

### Methods

| Method          | Description                                                                              |
|-----------------|------------------------------------------------------------------------------------------|
| `mount(canvas)` | Attach to a canvas element or CSS selector. Returns `this` for chaining.                 |
| `layer(effect)` | Add an effect layer. Returns `this` for chaining. Mounts immediately if already running. |
| `start()`       | Start the animation loop and mount all layers.                                           |
| `pause()`       | Pause the animation loop without destroying state.                                       |
| `resume()`      | Resume after a `pause()`.                                                                |
| `destroy()`     | Stop the loop, unmount all layers, and remove event listeners.                           |

### Example

```typescript
import { createAurora, createScene, createStars } from '@basmilius/sparkle';

createScene()
    .mount(canvas)
    .layer(createAurora({ bands: 6 }))
    .layer(createStars({ mode: 'shooting' }))
    .start();
```

---

## `Effect<TConfig>`

Abstract base class for all effects. Extend this to create custom effects that work both standalone and inside a `Scene`.

```typescript
abstract class Effect<TConfig = Record<string, unknown>> {
    abstract tick(dt: number, width: number, height: number): void;

    abstract draw(ctx: CanvasRenderingContext2D, width: number, height: number): void;

    configure(config: Partial<TConfig>): void;

    onResize(width: number, height: number): void;

    onMount(canvas: HTMLCanvasElement): void;

    onUnmount(canvas: HTMLCanvasElement): void;

    withFade(fade: EdgeFade): this;

    mount(canvas: HTMLCanvasElement | string, options?: CanvasRenderingContext2DSettings): this;

    unmount(): this;

    start(): this;

    pause(): this;

    resume(): this;

    destroy(): void;
}
```

| Method                     | Description                                                                                 |
|----------------------------|---------------------------------------------------------------------------------------------|
| `tick(dt, width, height)`  | Called every frame. `dt` is the normalized frame delta (1.0 = target frame rate).           |
| `draw(ctx, width, height)` | Called every frame after `tick`. Render into `ctx`.                                         |
| `configure(config)`        | Update live configuration without restarting. Typed to `Partial<TConfig>`.                  |
| `onResize(width, height)`  | Called when the canvas is resized. Use for pixel-coordinate initialization.                 |
| `onMount(canvas)`          | Called when added to a running simulation or when it starts. Use to attach event listeners. |
| `onUnmount(canvas)`        | Called when the simulation is destroyed. Use to remove event listeners.                     |
| `withFade(fade)`           | Apply an edge fade mask. Returns `this` for chaining.                                       |
| `mount(canvas)`            | Attach to a canvas for standalone use. Returns `this` for chaining.                         |
| `start()`                  | Start the render loop (standalone mode). Returns `this`.                                    |
| `pause()`                  | Pause rendering without destroying state. Returns `this`.                                   |
| `resume()`                 | Resume after `pause()`. Returns `this`.                                                     |
| `destroy()`                | Stop and unmount from the canvas.                                                           |

### Custom Effect Example

```typescript
import { Effect } from '@basmilius/sparkle';

interface ClockConfig {
    readonly color?: string;
}

class ClockEffect extends Effect<ClockConfig> {
    #color: string;

    constructor(config: ClockConfig = {}) {
        super();
        this.#color = config.color ?? 'white';
    }

    configure(config: Partial<ClockConfig>): void {
        if (config.color !== undefined) {
            this.#color = config.color;
        }
    }

    tick(_dt: number, _width: number, _height: number): void {
        // no per-frame state to update
    }

    draw(ctx: CanvasRenderingContext2D, _width: number, _height: number): void {
        const now = new Date();
        ctx.fillStyle = this.#color;
        ctx.font = '24px monospace';
        ctx.fillText(now.toLocaleTimeString(), 20, 40);
    }
}

// Standalone
new ClockEffect({color: '#ffcc00'}).mount(canvas).start();

// In a Scene
createScene()
    .mount(canvas)
    .layer(createAurora())
    .layer(new ClockEffect({color: '#ffcc00'}))
    .start();
```

---

## Available Effects

All effects extend `Effect<TConfig>` and can be used standalone or inside a `Scene`:

| Factory function    | Config type       |
|---------------------|-------------------|
| `createAurora`      | `AuroraConfig`    |
| `createBalloons`    | `BalloonsConfig`  |
| `createBubbles`     | `BubblesConfig`   |
| `createConfetti`    | `ConfettiConfig`  |
| `createDonuts`      | `DonutsConfig`    |
| `createFireflies`   | `FirefliesConfig` |
| `createFirepit`     | `FirepitConfig`   |
| `createFireworks`   | `FireworksConfig` |
| `createGlitter`     | `GlitterConfig`   |
| `createLanterns`    | `LanternsConfig`  |
| `createLeaves`      | `LeavesConfig`    |
| `createLightning`   | `LightningConfig` |
| `createMatrix`      | `MatrixConfig`    |
| `createOrbits`      | `OrbitsConfig`    |
| `createParticles`   | `ParticlesConfig` |
| `createPetals`      | `PetalsConfig`    |
| `createPlasma`      | `PlasmaConfig`    |
| `createRain`        | `RainConfig`      |
| `createSandstorm`   | `SandstormConfig` |
| `createSnow`        | `SnowConfig`      |
| `createSparklers`   | `SparklersConfig` |
| `createStars`       | `StarsConfig`     |
| `createStreamers`   | `StreamersConfig` |
| `createWaves`       | `WavesConfig`     |
| `createWormhole`    | `WormholeConfig`  |
