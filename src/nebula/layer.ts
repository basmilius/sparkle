import { Effect } from '../effect';
import { MULBERRY } from './consts';
import type { NebulaBlob, NebulaStar } from './types';

export interface NebulaConfig {
    readonly starCount?: number;
    readonly speed?: number;
    readonly colors?: string[];
    readonly scale?: number;
}

const DEFAULT_COLORS = ['#ff6b9d', '#c44dff', '#4d79ff', '#00d4ff'];

export class Nebula extends Effect<NebulaConfig> {
    readonly #scale: number;
    #speed: number;
    #time: number = 0;
    #colors: string[];
    #blobs: NebulaBlob[] = [];
    #stars: NebulaStar[] = [];
    #maxStars: number;

    constructor(config: NebulaConfig = {}) {
        super();

        this.#scale = config.scale ?? 1;
        this.#speed = config.speed ?? 0.3;
        this.#colors = config.colors ?? DEFAULT_COLORS;
        this.#maxStars = config.starCount ?? 150;

        if (typeof globalThis.innerWidth !== 'undefined' && globalThis.innerWidth < 991) {
            this.#maxStars = Math.floor(this.#maxStars / 2);
        }

        this.#initBlobs();
        this.#initStars();
    }

    configure(config: Partial<NebulaConfig>): void {
        if (config.speed !== undefined) {
            this.#speed = config.speed;
        }

        if (config.colors !== undefined) {
            this.#colors = config.colors;
        }
    }

    tick(dt: number, _width: number, _height: number): void {
        this.#time += 0.001 * this.#speed * dt;
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgb(2, 0, 20)';
        ctx.fillRect(0, 0, width, height);

        ctx.globalCompositeOperation = 'screen';

        for (const blob of this.#blobs) {
            const cx = (blob.x + Math.sin(this.#time * blob.driftSpeedX + blob.driftOffsetX) * 0.12) * width;
            const cy = (blob.y + Math.cos(this.#time * blob.driftSpeedY + blob.driftOffsetY) * 0.09) * height;
            const radius = blob.radius * Math.min(width, height) * this.#scale;

            const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
            const color = this.#colors[blob.colorIndex % this.#colors.length];
            gradient.addColorStop(0, this.#colorWithAlpha(color, blob.opacity));
            gradient.addColorStop(0.4, this.#colorWithAlpha(color, blob.opacity * 0.4));
            gradient.addColorStop(1, this.#colorWithAlpha(color, 0));

            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.ellipse(cx, cy, radius, radius * (0.6 + blob.opacity * 0.4), this.#time * 0.05 * blob.driftSpeedX, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';

        for (const star of this.#stars) {
            const px = star.x * width;
            const py = star.y * height;
            const twinkle = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(this.#time * star.twinkleSpeed * 60 + star.twinkleOffset));
            const alpha = star.brightness * twinkle;
            const size = star.size * this.#scale;

            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();

            if (star.brightness > 0.7 && size > 1) {
                ctx.globalAlpha = alpha * 0.4;
                ctx.beginPath();
                ctx.arc(px, py, size * 2.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.globalAlpha = 1;
        ctx.resetTransform();
        ctx.globalCompositeOperation = 'source-over';
    }

    #initBlobs(): void {
        const blobCount = 8 + this.#colors.length * 2;

        for (let i = 0; i < blobCount; ++i) {
            this.#blobs.push({
                x: 0.1 + MULBERRY.next() * 0.8,
                y: 0.1 + MULBERRY.next() * 0.8,
                radius: 0.3 + MULBERRY.next() * 0.3,
                driftSpeedX: 0.3 + MULBERRY.next() * 0.7,
                driftSpeedY: 0.2 + MULBERRY.next() * 0.6,
                driftOffsetX: MULBERRY.next() * Math.PI * 2,
                driftOffsetY: MULBERRY.next() * Math.PI * 2,
                colorIndex: Math.floor(MULBERRY.next() * this.#colors.length),
                opacity: 0.2 + MULBERRY.next() * 0.3
            });
        }
    }

    #initStars(): void {
        for (let i = 0; i < this.#maxStars; ++i) {
            this.#stars.push({
                x: MULBERRY.next(),
                y: MULBERRY.next(),
                size: 0.5 + MULBERRY.next() * 1.5,
                twinkleSpeed: 0.5 + MULBERRY.next() * 2,
                twinkleOffset: MULBERRY.next() * Math.PI * 2,
                brightness: 0.3 + MULBERRY.next() * 0.7
            });
        }
    }

    #colorWithAlpha(hex: string, alpha: number): string {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        if (!result) {
            return `rgba(255, 255, 255, ${alpha})`;
        }

        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}
