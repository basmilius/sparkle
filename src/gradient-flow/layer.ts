import { hexToRGB } from '@basmilius/utils';
import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { GradientBlob } from './types';

export interface GradientFlowConfig {
    readonly speed?: number;
    readonly scale?: number;
    readonly colors?: string[];
    readonly blobs?: number;
    readonly resolution?: number;
}

const DEFAULT_COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'];

export class GradientFlow extends Effect<GradientFlowConfig> {
    readonly #scale: number;
    #speed: number;
    readonly #resolution: number;
    #blobs: GradientBlob[] = [];
    #offscreen: HTMLCanvasElement | null = null;
    #offscreenCtx: CanvasRenderingContext2D | null = null;
    #imageData: ImageData | null = null;

    constructor(config: GradientFlowConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#speed = config.speed ?? 0.5;
        this.#resolution = config.resolution ?? 6;

        const colors = config.colors ?? [...DEFAULT_COLORS];
        const blobCount = config.blobs ?? 5;

        for (let index = 0; index < blobCount; index++) {
            const colorHex = colors[index % colors.length];
            const [r, g, b] = hexToRGB(colorHex);

            this.#blobs.push({
                x: MULBERRY.next(),
                y: MULBERRY.next(),
                vx: (MULBERRY.next() - 0.5) * 0.01,
                vy: (MULBERRY.next() - 0.5) * 0.01,
                radius: (0.15 + MULBERRY.next() * 0.2) * this.#scale,
                color: [r, g, b]
            });
        }
    }

    configure(config: Partial<GradientFlowConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }
    }

    tick(dt: number, _width: number, _height: number): void {
        const speed = this.#speed;

        for (const blob of this.#blobs) {
            blob.x += blob.vx * dt * speed;
            blob.y += blob.vy * dt * speed;

            if (blob.x < 0.05) {
                blob.vx = Math.abs(blob.vx);
            } else if (blob.x > 0.95) {
                blob.vx = -Math.abs(blob.vx);
            }

            if (blob.y < 0.05) {
                blob.vy = Math.abs(blob.vy);
            } else if (blob.y > 0.95) {
                blob.vy = -Math.abs(blob.vy);
            }
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
        const blobs = this.#blobs;
        const blobCount = blobs.length;

        for (let py = 0; py < offHeight; py++) {
            const normY = py / offHeight;

            for (let px = 0; px < offWidth; px++) {
                const normX = px / offWidth;

                let totalWeight = 0;
                let red = 0;
                let green = 0;
                let blue = 0;

                for (let bi = 0; bi < blobCount; bi++) {
                    const blob = blobs[bi];
                    const dx = normX - blob.x;
                    const dy = normY - blob.y;
                    const distSq = dx * dx + dy * dy;
                    const radiusSq = blob.radius * blob.radius;
                    const weight = radiusSq / (distSq + 0.001);

                    totalWeight += weight;
                    red += blob.color[0] * weight;
                    green += blob.color[1] * weight;
                    blue += blob.color[2] * weight;
                }

                const invWeight = 1 / totalWeight;

                const offset = (py * offWidth + px) * 4;
                data[offset] = Math.min(255, red * invWeight);
                data[offset + 1] = Math.min(255, green * invWeight);
                data[offset + 2] = Math.min(255, blue * invWeight);
                data[offset + 3] = 255;
            }
        }

        this.#offscreenCtx!.putImageData(this.#imageData!, 0, 0);

        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(this.#offscreen!, 0, 0, width, height);
    }
}
