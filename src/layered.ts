import { LimitedFrameRateCanvas } from './canvas';
import { applyEdgeFade } from './fade';
import type { SimulationLayer } from './layer';

export class LayeredSimulation extends LimitedFrameRateCanvas {
    readonly #layers: SimulationLayer[] = [];
    readonly #contextOptions: CanvasRenderingContext2DSettings;
    #offscreen: HTMLCanvasElement | null = null;
    #offscreenCtx: CanvasRenderingContext2D | null = null;

    constructor(canvas: HTMLCanvasElement, frameRate: number = 60, options: CanvasRenderingContext2DSettings = {colorSpace: 'display-p3'}) {
        super(canvas, frameRate, options);
        this.#contextOptions = options;

        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
    }

    configureLayer(index: number, config: Record<string, unknown>): void {
        this.#layers[index]?.configure(config);
    }

    add(layer: SimulationLayer): this {
        this.#layers.push(layer);

        if (this.isTicking) {
            layer.onMount(this.canvas);
        }

        return this;
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
