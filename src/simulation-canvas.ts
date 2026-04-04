import { LimitedFrameRateCanvas } from './canvas';
import { defaultContextSettings } from './color';
import { applyEdgeFade } from './fade';
import type { EdgeFade, SimulationLayer } from './layer';

export class SimulationCanvas extends LimitedFrameRateCanvas {
    readonly #simulation: SimulationLayer;
    readonly #contextOptions: CanvasRenderingContext2DSettings;
    #offscreen: HTMLCanvasElement | null = null;
    #offscreenCtx: CanvasRenderingContext2D | null = null;

    constructor(canvas: HTMLCanvasElement, simulation: SimulationLayer, frameRate: number = 60, options: CanvasRenderingContext2DSettings = defaultContextSettings()) {
        super(canvas, frameRate, options);
        this.#simulation = simulation;
        this.#contextOptions = options;

        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
    }

    withFade(fade: EdgeFade): this {
        this.#simulation.fade = fade;
        return this;
    }

    start(): void {
        this.#simulation.onMount(this.canvas);
        super.start();
    }

    destroy(): void {
        this.#simulation.onUnmount(this.canvas);
        super.destroy();
    }

    draw(): void {
        const dpr = this.dpr;
        this.canvas.height = this.height * dpr;
        this.canvas.width = this.width * dpr;

        const ctx = this.context;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        if (this.#simulation.fade) {
            const offCtx = this.#getOffscreenCtx(this.width * dpr, this.height * dpr);
            offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
            offCtx.clearRect(0, 0, this.width, this.height);
            this.#simulation.draw(offCtx, this.width, this.height);
            applyEdgeFade(offCtx, this.width, this.height, this.#simulation.fade);
            ctx.drawImage(this.#offscreen!, 0, 0, this.width, this.height);
        } else {
            ctx.save();
            this.#simulation.draw(ctx, this.width, this.height);
            ctx.restore();
        }
    }

    tick(): void {
        const dt = (this.delta > 0 && this.delta < 200 ? this.delta / (1000 / 60) : 1) * this.speed * LimitedFrameRateCanvas.globalSpeed;
        this.#simulation.tick(dt, this.width, this.height);
    }

    onResize(): void {
        super.onResize();

        if (this.#offscreen) {
            this.#offscreen.width = this.width * this.dpr;
            this.#offscreen.height = this.height * this.dpr;
        }

        this.#simulation.onResize(this.width, this.height);
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
