import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { DEFAULT_COLORS } from './consts';

export interface InterferenceConfig {
    readonly speed?: number;
    readonly scale?: number;
    readonly resolution?: number;
    readonly layers?: number;
    readonly colors?: string[];
}

export class Interference extends Effect<InterferenceConfig> {
    #speed: number;
    #scale: number;
    readonly #resolution: number;
    readonly #layerCount: number;
    #colorRGBs: [number, number, number][];
    #time: number = 0;
    #offscreen: HTMLCanvasElement | null = null;
    #offscreenCtx: CanvasRenderingContext2D | null = null;
    #imageData: ImageData | null = null;
    #centers: { x: number; y: number; freqX: number; freqY: number; phaseX: number; phaseY: number; speedMul: number }[];

    constructor(config: InterferenceConfig = {}) {
        super();

        this.#speed = config.speed ?? 1;
        this.#scale = config.scale ?? 1;
        this.#resolution = config.resolution ?? 3;
        this.#layerCount = config.layers ?? 3;

        const colors = config.colors ?? DEFAULT_COLORS;
        this.#colorRGBs = colors.map(c => hexToRGB(c));

        this.#centers = [];

        for (let idx = 0; idx < this.#layerCount; idx++) {
            this.#centers.push({
                x: 0,
                y: 0,
                freqX: 0.3 + idx * 0.17,
                freqY: 0.2 + idx * 0.13,
                phaseX: idx * Math.PI * 2 / this.#layerCount,
                phaseY: idx * Math.PI * 1.3 / this.#layerCount,
                speedMul: 0.7 + idx * 0.3
            });
        }
    }

    configure(config: Partial<InterferenceConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.scale !== undefined) {
            this.#scale = config.scale;
        }
        if (config.colors !== undefined) {
            this.#colorRGBs = config.colors.map(color => hexToRGB(color));
        }
    }

    tick(dt: number, width: number, height: number): void {
        this.#time += 0.015 * dt * this.#speed;

        for (let idx = 0; idx < this.#centers.length; idx++) {
            const center = this.#centers[idx];
            center.x = (0.5 + 0.35 * Math.sin(this.#time * center.freqX + center.phaseX)) * width;
            center.y = (0.5 + 0.35 * Math.cos(this.#time * center.freqY + center.phaseY)) * height;
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const resolution = this.#resolution;
        const offWidth = Math.ceil(width / resolution);
        const offHeight = Math.ceil(height / resolution);

        if (!this.#offscreen || this.#offscreen.width !== offWidth || this.#offscreen.height !== offHeight) {
            this.#offscreen = document.createElement('canvas');
            this.#offscreen.width = offWidth;
            this.#offscreen.height = offHeight;
            this.#offscreenCtx = this.#offscreen.getContext('2d');
            this.#imageData = this.#offscreenCtx!.createImageData(offWidth, offHeight);
        }

        const data = this.#imageData!.data;
        const scale = this.#scale;
        const freq = 30 * scale;
        const centers = this.#centers;
        const centerCount = centers.length;
        const colorRGBs = this.#colorRGBs;
        const colorCount = colorRGBs.length;

        for (let py = 0; py < offHeight; py++) {
            const worldY = py * resolution;

            for (let px = 0; px < offWidth; px++) {
                const worldX = px * resolution;

                let totalR = 0;
                let totalG = 0;
                let totalB = 0;

                for (let ci = 0; ci < centerCount; ci++) {
                    const center = centers[ci];
                    const dx = worldX - center.x;
                    const dy = worldY - center.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    const wave = (Math.sin(dist / freq) + 1) * 0.5;
                    const color = colorRGBs[ci % colorCount];

                    totalR += color[0] * wave;
                    totalG += color[1] * wave;
                    totalB += color[2] * wave;
                }

                const maxVal = centerCount * 255;
                const offset = (py * offWidth + px) * 4;
                data[offset] = Math.min(255, (totalR / maxVal) * 255) | 0;
                data[offset + 1] = Math.min(255, (totalG / maxVal) * 255) | 0;
                data[offset + 2] = Math.min(255, (totalB / maxVal) * 255) | 0;
                data[offset + 3] = 255;
            }
        }

        this.#offscreenCtx!.putImageData(this.#imageData!, 0, 0);

        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(this.#offscreen!, 0, 0, width, height);
    }
}
