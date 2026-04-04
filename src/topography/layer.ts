import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';

export interface TopographyConfig {
    readonly speed?: number;
    readonly scale?: number;
    readonly resolution?: number;
    readonly contourSpacing?: number;
    readonly lineWidth?: number;
    readonly color?: string;
}

export class Topography extends Effect<TopographyConfig> {
    #speed: number;
    #scale: number;
    readonly #resolution: number;
    #contourSpacing: number;
    #lineWidth: number;
    #colorR: number;
    #colorG: number;
    #colorB: number;
    #time: number = 0;
    #offscreen: HTMLCanvasElement | null = null;
    #offscreenCtx: CanvasRenderingContext2D | null = null;
    #imageData: ImageData | null = null;

    constructor(config: TopographyConfig = {}) {
        super();

        this.#speed = config.speed ?? 0.5;
        this.#scale = config.scale ?? 1;
        this.#resolution = config.resolution ?? 2;
        this.#contourSpacing = config.contourSpacing ?? 0.1;
        this.#lineWidth = config.lineWidth ?? 1.5;

        const [cr, cg, cb] = hexToRGB(config.color ?? '#2d5016');
        this.#colorR = cr;
        this.#colorG = cg;
        this.#colorB = cb;
    }

    configure(config: Partial<TopographyConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
        if (config.scale !== undefined) {
            this.#scale = config.scale;
        }
        if (config.color !== undefined) {
            const [cr, cg, cb] = hexToRGB(config.color);
            this.#colorR = cr;
            this.#colorG = cg;
            this.#colorB = cb;
        }
        if (config.lineWidth !== undefined) {
            this.#lineWidth = config.lineWidth;
        }
        if (config.contourSpacing !== undefined) {
            this.#contourSpacing = config.contourSpacing;
        }
    }

    tick(dt: number, _width: number, _height: number): void {
        this.#time += 0.02 * dt * this.#speed;
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
        const spacing = this.#contourSpacing;
        const lineWidth = this.#lineWidth;
        const colorR = this.#colorR;
        const colorG = this.#colorG;
        const colorB = this.#colorB;

        const freq1 = 80 * scale;
        const freq2 = 50 * scale;
        const freq3 = 30 * scale;

        const heightField = new Float32Array(offWidth * offHeight);

        for (let py = 0; py < offHeight; py++) {
            const worldY = py * resolution;

            for (let px = 0; px < offWidth; px++) {
                const worldX = px * resolution;

                const value = Math.sin(worldX / freq1 + time) * Math.sin(worldY / freq1 + time * 0.7)
                    + 0.5 * Math.sin(worldX / freq2 + worldY / freq2 + time * 1.3)
                    + 0.25 * Math.sin(worldX / freq3 - time * 0.5) * Math.sin(worldY / freq3 + time * 0.9);

                heightField[py * offWidth + px] = value;
            }
        }

        for (let py = 0; py < offHeight; py++) {
            for (let px = 0; px < offWidth; px++) {
                const index = py * offWidth + px;
                const value = heightField[index];
                const contourLevel = Math.floor(value / spacing);

                let isContour = false;

                if (px < offWidth - 1) {
                    const rightLevel = Math.floor(heightField[index + 1] / spacing);
                    if (contourLevel !== rightLevel) {
                        isContour = true;
                    }
                }

                if (!isContour && py < offHeight - 1) {
                    const belowLevel = Math.floor(heightField[index + offWidth] / spacing);
                    if (contourLevel !== belowLevel) {
                        isContour = true;
                    }
                }

                const offset = index * 4;

                if (isContour) {
                    const alpha = Math.min(255, 255 * lineWidth);
                    data[offset] = colorR;
                    data[offset + 1] = colorG;
                    data[offset + 2] = colorB;
                    data[offset + 3] = alpha;
                } else {
                    data[offset] = colorR;
                    data[offset + 1] = colorG;
                    data[offset + 2] = colorB;
                    data[offset + 3] = 10;
                }
            }
        }

        this.#offscreenCtx!.putImageData(this.#imageData!, 0, 0);

        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(this.#offscreen!, 0, 0, width, height);
    }
}
