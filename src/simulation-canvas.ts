import { LimitedFrameRateCanvas } from './canvas';
import type { SimulationLayer } from './layer';

export class SimulationCanvas extends LimitedFrameRateCanvas {
    readonly #simulation: SimulationLayer;

    constructor(canvas: HTMLCanvasElement, simulation: SimulationLayer, frameRate: number = 60, options: CanvasRenderingContext2DSettings = {colorSpace: 'display-p3'}) {
        super(canvas, frameRate, options);
        this.#simulation = simulation;

        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
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
        ctx.save();
        this.#simulation.draw(ctx, this.width, this.height);
        ctx.restore();
    }

    tick(): void {
        const dt = (this.delta > 0 && this.delta < 200 ? this.delta / (1000 / 60) : 1) * this.speed * LimitedFrameRateCanvas.globalSpeed;
        this.#simulation.tick(dt, this.width, this.height);
    }

    onResize(): void {
        super.onResize();
        this.#simulation.onResize(this.width, this.height);
    }
}
