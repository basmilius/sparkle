import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';

export interface CausticsConfig {
    readonly speed?: number;
    readonly scale?: number;
    readonly resolution?: number;
    readonly intensity?: number;
    readonly color?: string;
}

export class Caustics extends Effect<CausticsConfig> {
    #speed: number;
    #scale: number;
    readonly #resolution: number;
    #intensity: number;
    #colorR: number;
    #colorG: number;
    #colorB: number;
    #time: number = 0;
    #offscreen: HTMLCanvasElement | null = null;
    #offscreenCtx: CanvasRenderingContext2D | null = null;
    #imageData: ImageData | null = null;

    constructor(config: CausticsConfig = {}) {
        super();

        this.#speed = config.speed ?? 1;
        this.#scale = config.scale ?? 1;
        this.#resolution = config.resolution ?? 4;
        this.#intensity = config.intensity ?? 0.7;

        const [r, g, b] = hexToRGB(config.color ?? '#4488cc');
        this.#colorR = r;
        this.#colorG = g;
        this.#colorB = b;
    }

    configure(config: Partial<CausticsConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.intensity !== undefined) {
            this.#intensity = config.intensity;
        }
        if (config.color !== undefined) {
            const [r, g, b] = hexToRGB(config.color);
            this.#colorR = r;
            this.#colorG = g;
            this.#colorB = b;
        }
        if (config.scale !== undefined) {
            this.#scale = config.scale;
        }
    }

    tick(dt: number, _width: number, _height: number): void {
        this.#time += 0.015 * dt * this.#speed;
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
        const time = this.#time;
        const scale = this.#scale;
        const intensity = this.#intensity;
        const colorR = this.#colorR;
        const colorG = this.#colorG;
        const colorB = this.#colorB;

        const freq1 = 40 * scale;
        const freq2 = 30 * scale;
        const freq3 = 35 * scale;
        const freq4 = 25 * scale;
        const freq5 = 45 * scale;
        const amplitude = 2.5;

        for (let py = 0; py < offHeight; py++) {
            const worldY = py * resolution;

            for (let px = 0; px < offWidth; px++) {
                const worldX = px * resolution;

                const v1 = Math.sin(worldX / freq1 + Math.sin(worldY / freq2 + time) * amplitude);
                const v2 = Math.sin(worldY / freq3 + Math.sin(worldX / freq4 + time * 0.7) * amplitude);
                const v3 = Math.sin((worldX + worldY) / freq5 + time * 0.5);

                const caustic = (v1 + v2 + v3) / 3;
                const clamped = Math.max(0, caustic);
                const brightness = Math.pow(clamped, 2) * intensity;

                const offset = (py * offWidth + px) * 4;
                data[offset] = Math.min(255, colorR * brightness + (1 - brightness) * colorR * 0.15);
                data[offset + 1] = Math.min(255, colorG * brightness + (1 - brightness) * colorG * 0.15);
                data[offset + 2] = Math.min(255, colorB * brightness + (1 - brightness) * colorB * 0.15);
                data[offset + 3] = 255;
            }
        }

        this.#offscreenCtx!.putImageData(this.#imageData!, 0, 0);

        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(this.#offscreen!, 0, 0, width, height);
    }
}
