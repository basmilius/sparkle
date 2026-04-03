import { LimitedFrameRateCanvas } from './canvas';
import { applyEdgeFade } from './fade';
import type { SimulationLayer } from './layer';

/**
 * Internal canvas runner that drives all layers in a Scene.
 */
class SceneCanvas extends LimitedFrameRateCanvas {
    readonly #layers: SimulationLayer[];
    readonly #contextOptions: CanvasRenderingContext2DSettings;
    #offscreen: HTMLCanvasElement | null = null;
    #offscreenCtx: CanvasRenderingContext2D | null = null;

    constructor(canvas: HTMLCanvasElement, layers: SimulationLayer[], frameRate: number, options: CanvasRenderingContext2DSettings) {
        super(canvas, frameRate, options);
        this.#layers = layers;
        this.#contextOptions = options;

        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
    }

    start(): void {
        for (const layer of this.#layers) {
            layer.onMount(this.canvas);
        }
        super.start();
    }

    destroy(): void {
        for (const layer of this.#layers) {
            layer.onUnmount(this.canvas);
        }
        super.destroy();
    }

    draw(): void {
        this.canvas.height = this.height;
        this.canvas.width = this.width;

        const ctx = this.context;
        ctx.clearRect(0, 0, this.width, this.height);

        for (const layer of this.#layers) {
            if (layer.fade) {
                const offCtx = this.#getOffscreenCtx(this.width, this.height);
                offCtx.clearRect(0, 0, this.width, this.height);
                layer.draw(offCtx, this.width, this.height);
                applyEdgeFade(offCtx, this.width, this.height, layer.fade);
                ctx.drawImage(this.#offscreen!, 0, 0);
            } else {
                ctx.save();
                layer.draw(ctx, this.width, this.height);
                ctx.restore();
            }
        }
    }

    tick(): void {
        const dt = (this.delta > 0 && this.delta < 200 ? this.delta / (1000 / 60) : 1) * this.speed * LimitedFrameRateCanvas.globalSpeed;

        for (const layer of this.#layers) {
            layer.tick(dt, this.width, this.height);
        }
    }

    onResize(): void {
        super.onResize();

        if (this.#offscreen) {
            this.#offscreen.width = this.width;
            this.#offscreen.height = this.height;
        }

        for (const layer of this.#layers) {
            layer.onResize(this.width, this.height);
        }
    }

    #getOffscreenCtx(width: number, height: number): CanvasRenderingContext2D {
        if (!this.#offscreen) {
            this.#offscreen = document.createElement('canvas');
            this.#offscreen.width = width;
            this.#offscreen.height = height;
            this.#offscreenCtx = this.#offscreen.getContext('2d', this.#contextOptions)!;
        }

        return this.#offscreenCtx!;
    }
}

/**
 * Composable canvas that renders multiple Effect layers in order (first = bottom, last = top).
 *
 * @example
 * const scene = new Scene()
 *     .mount(canvas)
 *     .layer(new Aurora({ bands: 5 }))
 *     .layer(new Stars().withFade({ bottom: 0.4 }))
 *     .start();
 */
export class Scene {
    readonly #layers: SimulationLayer[] = [];
    readonly #frameRate: number;
    readonly #defaultOptions: CanvasRenderingContext2DSettings;
    #runner: SceneCanvas | null = null;

    constructor(frameRate: number = 60, options: CanvasRenderingContext2DSettings = {colorSpace: 'display-p3'}) {
        this.#frameRate = frameRate;
        this.#defaultOptions = options;
    }

    /**
     * Mount the scene to a canvas element or CSS selector.
     */
    mount(canvas: HTMLCanvasElement | string, options?: CanvasRenderingContext2DSettings): this {
        if (typeof canvas === 'string') {
            const el = document.querySelector<HTMLCanvasElement>(canvas);

            if (!el) {
                throw new Error(`Scene.mount(): no element found for selector "${canvas}".`);
            }

            canvas = el;
        }

        this.#runner?.destroy();
        this.#runner = new SceneCanvas(canvas, this.#layers, this.#frameRate, options ?? this.#defaultOptions);
        return this;
    }

    /**
     * Add an effect layer. Layers are rendered in the order they are added.
     * If the scene is already running, the layer is mounted immediately.
     */
    layer(effect: SimulationLayer): this {
        this.#layers.push(effect);

        if (this.#runner?.isTicking) {
            effect.onMount(this.#runner.canvas);
        }

        return this;
    }

    /**
     * Start the render loop.
     */
    start(): this {
        this.#runner?.start();
        return this;
    }

    /**
     * Pause rendering without destroying state. Use resume() to continue.
     */
    pause(): this {
        this.#runner?.pause();
        return this;
    }

    /**
     * Resume rendering after pause().
     */
    resume(): this {
        this.#runner?.resume();
        return this;
    }

    /**
     * Stop and destroy all layers.
     */
    destroy(): void {
        this.#runner?.destroy();
        this.#runner = null;
    }

    get speed(): number {
        return this.#runner?.speed ?? 1;
    }

    set speed(value: number) {
        if (this.#runner) {
            this.#runner.speed = value;
        }
    }

    get isTicking(): boolean {
        return this.#runner?.isTicking ?? false;
    }
}

/**
 * Factory alternative to `new Scene()`. Call .mount() and .layer() on the returned instance.
 */
export function createScene(frameRate?: number, options?: CanvasRenderingContext2DSettings): Scene {
    return new Scene(frameRate, options);
}
