import { LimitedFrameRateCanvas } from './canvas';
import type { EdgeFade, EdgeFadeSide, SimulationLayer } from './layer';

function parseSide(side: EdgeFadeSide): [number, number] {
    return typeof side === 'number' ? [0, side] : side;
}


function applyEdgeFade(ctx: CanvasRenderingContext2D, width: number, height: number, fade: EdgeFade): void {
    ctx.globalCompositeOperation = 'destination-out';

    if (fade.top !== undefined) {
        const [near, far] = parseSide(fade.top);
        const nearPx = near * height;
        const farPx = far * height;

        if (nearPx > 0) {
            ctx.fillStyle = 'rgba(0,0,0,1)';
            ctx.fillRect(0, 0, width, nearPx);
        }

        if (farPx > nearPx) {
            const gradient = ctx.createLinearGradient(0, nearPx, 0, farPx);
            gradient.addColorStop(0, 'rgba(0,0,0,1)');
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, nearPx, width, farPx - nearPx);
        }
    }

    if (fade.bottom !== undefined) {
        const [near, far] = parseSide(fade.bottom);
        const nearPx = near * height;
        const farPx = far * height;

        if (nearPx > 0) {
            ctx.fillStyle = 'rgba(0,0,0,1)';
            ctx.fillRect(0, height - nearPx, width, nearPx);
        }

        if (farPx > nearPx) {
            const gradient = ctx.createLinearGradient(0, height - farPx, 0, height - nearPx);
            gradient.addColorStop(0, 'rgba(0,0,0,0)');
            gradient.addColorStop(1, 'rgba(0,0,0,1)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, height - farPx, width, farPx - nearPx);
        }
    }

    if (fade.left !== undefined) {
        const [near, far] = parseSide(fade.left);
        const nearPx = near * width;
        const farPx = far * width;

        if (nearPx > 0) {
            ctx.fillStyle = 'rgba(0,0,0,1)';
            ctx.fillRect(0, 0, nearPx, height);
        }

        if (farPx > nearPx) {
            const gradient = ctx.createLinearGradient(nearPx, 0, farPx, 0);
            gradient.addColorStop(0, 'rgba(0,0,0,1)');
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(nearPx, 0, farPx - nearPx, height);
        }
    }

    if (fade.right !== undefined) {
        const [near, far] = parseSide(fade.right);
        const nearPx = near * width;
        const farPx = far * width;

        if (nearPx > 0) {
            ctx.fillStyle = 'rgba(0,0,0,1)';
            ctx.fillRect(width - nearPx, 0, nearPx, height);
        }

        if (farPx > nearPx) {
            const gradient = ctx.createLinearGradient(width - farPx, 0, width - nearPx, 0);
            gradient.addColorStop(0, 'rgba(0,0,0,0)');
            gradient.addColorStop(1, 'rgba(0,0,0,1)');
            ctx.fillStyle = gradient;
            ctx.fillRect(width - farPx, 0, farPx - nearPx, height);
        }
    }

    ctx.globalCompositeOperation = 'source-over';
}

export class LayeredSimulation extends LimitedFrameRateCanvas {
    readonly #layers: SimulationLayer[] = [];
    readonly #contextOptions: CanvasRenderingContext2DSettings;
    #offscreen: HTMLCanvasElement | null = null;
    #offscreenCtx: CanvasRenderingContext2D | null = null;

    constructor(canvas: HTMLCanvasElement, frameRate: number = 60, options: CanvasRenderingContext2DSettings = {colorSpace: 'display-p3'}) {
        super(canvas, frameRate, options);
        this.#contextOptions = options;
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
