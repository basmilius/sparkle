import { LimitedFrameRateCanvas } from '../canvas';
import type { PlasmaColor } from './types';

export interface PlasmaSimulationConfig {
    readonly speed?: number;
    readonly scale?: number;
    readonly resolution?: number;
    readonly palette?: PlasmaColor[];
    readonly canvasOptions?: CanvasRenderingContext2DSettings;
}

const DEFAULT_PALETTE: PlasmaColor[] = [
    {r: 0, g: 255, b: 255},
    {r: 255, g: 0, b: 255},
    {r: 255, g: 255, b: 0},
    {r: 0, g: 100, b: 255},
    {r: 0, g: 255, b: 100}
];

export class PlasmaSimulation extends LimitedFrameRateCanvas {
    readonly #speed: number;
    readonly #scale: number;
    readonly #resolution: number;
    readonly #palette: PlasmaColor[];
    #time: number = 0;
    #offscreen: HTMLCanvasElement | null = null;
    #offscreenCtx: CanvasRenderingContext2D | null = null;
    #imageData: ImageData | null = null;

    constructor(canvas: HTMLCanvasElement, config: PlasmaSimulationConfig = {}) {
        super(canvas, 60, config.canvasOptions ?? {colorSpace: 'display-p3'});

        this.#speed = config.speed ?? 1;
        this.#scale = config.scale ?? 1;
        this.#resolution = config.resolution ?? 4;
        this.#palette = config.palette ?? DEFAULT_PALETTE;

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';
    }

    draw(): void {
        this.canvas.height = this.height;
        this.canvas.width = this.width;

        const resolution = this.#resolution;
        const offWidth = Math.ceil(this.width / resolution);
        const offHeight = Math.ceil(this.height / resolution);

        if (!this.#offscreen || this.#offscreen.width !== offWidth || this.#offscreen.height !== offHeight) {
            this.#offscreen = document.createElement('canvas');
            this.#offscreen.width = offWidth;
            this.#offscreen.height = offHeight;
            this.#offscreenCtx = this.#offscreen.getContext('2d');
            this.#imageData = this.#offscreenCtx!.createImageData(offWidth, offHeight);
        }

        const data = this.#imageData!.data;
        const time = this.#time;
        const scale = this.#scale;
        const freq = 50 * scale;
        const palette = this.#palette;
        const paletteLen = palette.length;

        for (let py = 0; py < offHeight; py++) {
            const worldY = py * resolution;

            for (let px = 0; px < offWidth; px++) {
                const worldX = px * resolution;

                const value = Math.sin(worldX / freq + time)
                    + Math.sin(worldY / freq + time * 0.7)
                    + Math.sin((worldX + worldY) / (freq * 1.3) + time * 1.3)
                    + Math.sin(Math.sqrt(worldX * worldX + worldY * worldY) / freq + time * 0.5);

                const normalized = (value + 4) / 8;
                const mapped = normalized * (paletteLen - 1);
                const index = Math.floor(mapped);
                const frac = mapped - index;

                const colorA = palette[index];
                const colorB = palette[Math.min(index + 1, paletteLen - 1)];

                const red = colorA.r + (colorB.r - colorA.r) * frac;
                const green = colorA.g + (colorB.g - colorA.g) * frac;
                const blue = colorA.b + (colorB.b - colorA.b) * frac;

                const offset = (py * offWidth + px) * 4;
                data[offset] = red;
                data[offset + 1] = green;
                data[offset + 2] = blue;
                data[offset + 3] = 255;
            }
        }

        this.#offscreenCtx!.putImageData(this.#imageData!, 0, 0);

        const ctx = this.context;
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(this.#offscreen!, 0, 0, this.width, this.height);
    }

    tick(): void {
        const dt = this.delta > 0 && this.delta < 200 ? this.delta / (1000 / 60) : 1;
        this.#time += 0.02 * dt * this.#speed;
    }
}
