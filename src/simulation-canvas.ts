import { LimitedFrameRateCanvas } from './canvas';
import { applyEdgeFade } from './fade';
import type { EdgeFade, SimulationLayer } from './layer';

export class SimulationCanvas extends LimitedFrameRateCanvas {
    readonly #simulation: SimulationLayer;
    readonly #contextOptions: CanvasRenderingContext2DSettings;
    #offscreen: HTMLCanvasElement | null = null;
    #offscreenCtx: CanvasRenderingContext2D | null = null;

    constructor(canvas: HTMLCanvasElement, simulation: SimulationLayer, frameRate: number = 60, options: CanvasRenderingContext2DSettings = {colorSpace: 'display-p3'}) {
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
        this.#simulation.withFade(fade);
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
        this.canvas.height = this.height;
        this.canvas.width = this.width;

        const ctx = this.context;

        if (this.#simulation.fade) {
            const offCtx = this.#getOffscreenCtx(this.width, this.height);
            offCtx.clearRect(0, 0, this.width, this.height);
            this.#simulation.draw(offCtx, this.width, this.height);
            applyEdgeFade(offCtx, this.width, this.height, this.#simulation.fade);
            ctx.drawImage(this.#offscreen!, 0, 0);
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

    configure(config: Record<string, unknown>): void {
        this.#simulation.configure(config);
    }

    onResize(): void {
        super.onResize();

        if (this.#offscreen) {
            this.#offscreen.width = this.width;
            this.#offscreen.height = this.height;
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
